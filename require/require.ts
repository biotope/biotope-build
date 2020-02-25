/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CommonJSModule<T = any> { exports: T }

type RequireBase = (rootRequire: boolean, currentPath: string, file: string) => CommonJSModule['exports'];

type RequireBound = (file: string) => ReturnType<RequireBase>;

interface CachedModule {
  module: CommonJSModule;
}

interface RequireOptions {
  __cache: Record<string, CachedModule>;
  __base: RequireBase;
}

type Require = RequireBound & RequireOptions;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtendedWindow<T = any> = typeof window & {
  exports: T;
  require: Require;
  __require_root: string;
  module: CommonJSModule<T>;
};

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

const createCommonJsModuleCache = (url: string): CachedModule => {
  const exports = {};
  const module: CommonJSModule = { exports };
  (window as ExtendedWindow).require.__cache[url] = { module };
  return (window as ExtendedWindow).require.__cache[url];
};

const runAndCache = (url: string, code: string): void => {
  const cache = createCommonJsModuleCache(url);
  const path = getCurrentPath(url);
  const require: RequireBound = (window as ExtendedWindow).require.__base.bind(window, false, path);
  // eslint-disable-next-line no-new-func
  (new Function('exports', 'require', 'module', '__filename', '__dirname', code))
    .call(window, cache.module.exports, require, cache.module, url, path);
};

const isCached = (key: string): boolean => Object
  .keys((window as ExtendedWindow).require.__cache).indexOf(key) >= 0;

const getCached = (key: string): CachedModule => (window as ExtendedWindow).require.__cache[key];

const requireBase: RequireBase = (rootRequire: boolean, currentPath: string, file: string) => {
  const scriptSource = (lastOf<HTMLScriptElement>(document.querySelectorAll('script')) || {}).src;
  const path = rootRequire && scriptSource ? getCurrentPath(scriptSource) : currentPath;
  const url = `${window.location.origin}/${resolveRelativity(file, path)}`;

  if (!isCached(url)) {
    runAndCache(url, fetchSync(url) || '');
  }
  return getCached(url).module.exports;
};

const initRootRequireWindow = (rootPath: string): void => {
  (window as ExtendedWindow).exports = {};

  (window as ExtendedWindow).require = requireBase.bind(window, true, rootPath);
  (window as ExtendedWindow).require.__base = requireBase;
  (window as ExtendedWindow).require.__cache = {};

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  (window as ExtendedWindow).module = {
    exports: (window as ExtendedWindow).exports,
  };
};

if (window && !(window as ExtendedWindow).require) {
  const rootPath = typeof (window as ExtendedWindow).__require_root === 'string'
    ? (window as ExtendedWindow).__require_root
    : getCurrentPath(window.location.href.indexOf('/') === window.location.href.length - 1
      ? window.location.href.slice(0, window.location.href.length - 1)
      : window.location.href);

  initRootRequireWindow(rootPath);
}
/* eslint-enable no-underscore-dangle */
