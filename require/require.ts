// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequireBase = (rootRequire: boolean, currentPath: string, file: string) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequireBound = (file: string) => any;

interface ESModule {
  module: {
    exports: object;
  };
}

interface RequireOptions {
  __cache: Record<string, ESModule>;
  __base: RequireBase;
}

type Require = RequireBound & RequireOptions;

interface RequireWindowExtension {
  require: Require;
  __require_root: string;
}

type ExtendedWindow = typeof window & RequireWindowExtension;

const createElementAndSet = <T extends HTMLElement>(
  tag: string, prop: string, value: string,
): T => {
  const element = document.createElement(tag);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (element as any as Record<string, string>)[prop] = value;
  return element as T;
};

const lastOf = <T extends Node>(nodes: NodeListOf<T>): T => (
  [].slice.call(nodes) as T[]
).reverse()[0];

const getCurrentPath = (url: string): string => createElementAndSet<HTMLAnchorElement>('a', 'href', url)
  .pathname
  .split('/')
  .reverse().slice(1).reverse()
  .filter((slug) => !!slug)
  .join('/');

const resolveRelativity = (path: string, currentPath: string): string => {
  const result = path === '.' ? 'index.js' : path;
  return (result.indexOf('./') === 0 ? result.substr(2) : result)
    .split('/')
    .reduce((accumulator, slug) => ([
      ...(slug === '..' ? accumulator.slice(0, accumulator.length - 1) : accumulator),
      ...(slug === '.' ? [currentPath] : []),
      ...(slug.indexOf('.') !== 0 ? [slug] : []),
    ]), currentPath.split('/'))
    .filter((slug) => !!slug)
    .join('/')
    .replace(':/', '://');
};

const fetchSync = (url: string): string | undefined => {
  const request = new XMLHttpRequest();
  request.open('GET', url, false);
  request.setRequestHeader('Content-Type', 'text/plain');
  request.send();
  return request.status === 200 ? request.responseText : undefined;
};

const removeSourceMaps = (code: string): string => code.replace(new RegExp('\\/\\/\\# sourceMappingURL\\=.*'), '');

const runAndCache = (url: string, code: string): void => {
  const script = createElementAndSet('script', 'innerHTML', `
    ;(function() {
      var module = window.require.__cache["${url}"].module;
      var newPath = "${getCurrentPath(url)}";
      function exec(exports, require, module, __filename, __dirname) {;
        ${removeSourceMaps(code || '')}
      ;}
      exec.call(window, module.exports, window.require.__base.bind(window, false, newPath), module, "${url}", newPath);
    })();
  `);
  document.body.appendChild(script);
  document.body.removeChild(script);
};

const isCached = (url: string): boolean => Object
  // eslint-disable-next-line no-underscore-dangle
  .keys((window as ExtendedWindow).require.__cache).indexOf(url) >= 0;

// eslint-disable-next-line no-underscore-dangle
const getCached = (url: string): ESModule => (window as ExtendedWindow).require.__cache[url];

const requireBase: RequireBase = (rootRequire: boolean, currentPath: string, file: string) => {
  const scriptSource = (lastOf<HTMLScriptElement>(document.querySelectorAll('script')) || {}).src;
  const path = rootRequire && scriptSource ? getCurrentPath(scriptSource) : currentPath;
  const url = `${window.location.origin}/${resolveRelativity(file, path)}`;

  if (isCached(url)) {
    return getCached(url).module.exports;
  }

  const module = { exports: {} };
  Object.freeze(module);
  // eslint-disable-next-line no-underscore-dangle
  (window as ExtendedWindow).require.__cache[url] = { module };

  runAndCache(url, fetchSync(url) || '');
  return getCached(url).module.exports;
};

if (window && !(window as ExtendedWindow).require) {
  // eslint-disable-next-line no-underscore-dangle
  const rootPath = typeof (window as ExtendedWindow).__require_root === 'string'
    // eslint-disable-next-line no-underscore-dangle
    ? (window as ExtendedWindow).__require_root
    : getCurrentPath(window.location.href.indexOf('/') === window.location.href.length - 1
      ? window.location.href.slice(0, window.location.href.length - 1)
      : window.location.href);

  (window as ExtendedWindow).require = requireBase.bind(window, true, rootPath);
  // eslint-disable-next-line no-underscore-dangle
  (window as ExtendedWindow).require.__base = requireBase;
  // eslint-disable-next-line no-underscore-dangle
  (window as ExtendedWindow).require.__cache = {};
}
