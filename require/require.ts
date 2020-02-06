// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FullRequire = (rootRequire: boolean, currentPath: string, file: string) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Require = (file: string) => any;

interface WindowRequireExtensions {
  require: Require;
}

interface WindowCacheExtensions {
  __require_imports: Record<string, object>;
}

type ExtendedWindow = typeof window & WindowCacheExtensions & WindowRequireExtensions;

type ExtensionType = 'executable' | 'object'; // | 'style';

if (window && !(window as ExtendedWindow).require) {
  // eslint-disable-next-line no-underscore-dangle
  if (!(window as ExtendedWindow).__require_imports) {
    // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/camelcase
    (window as ExtendedWindow).__require_imports = {};
  }

  const extensionTypes: Record<ExtensionType, string[]> = {
    executable: ['js'],
    object: ['json'],
    // style: ['css'],
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

  const someEquals = <T>(array: T[], value: T): boolean => array
    .filter((item) => item === value).length > 0;

  const toExtensionType = (extension: ExtensionType): ExtensionType => Object.keys(extensionTypes)
    .filter((key: ExtensionType) => someEquals(extensionTypes[key], extension))[0] as ExtensionType;

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

  const getExports = (fullRequire: FullRequire, url: string, code: string): object => {
    const module: { exports: object } = { exports: {} };
    const newCurrentPath = getCurrentPath(url);
    const innerRequire = fullRequire.bind(window, false, newCurrentPath) as Require;
    // eslint-disable-next-line no-new-func
    (new Function('exports', 'require', 'module', '__filename', '__dirname', code))
      .call(window, module.exports, innerRequire, module, url, newCurrentPath);
    return module.exports;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cacheCall = (key: string, content: any): void => {
    // eslint-disable-next-line no-underscore-dangle
    (window as ExtendedWindow).__require_imports[key] = content;
  };

  const isCached = (key: string): boolean => Object
    // eslint-disable-next-line no-underscore-dangle
    .keys((window as ExtendedWindow).__require_imports).indexOf(key) >= 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-underscore-dangle
  const getFromCache = (key: string): any => (window as ExtendedWindow).__require_imports[key];

  const require: FullRequire = (rootRequire: boolean, currentPath: string, file: string) => {
    const extension = toExtensionType(file.split('.').pop() as ExtensionType);
    const scriptSource = (lastOf<HTMLScriptElement>(document.querySelectorAll('script')) || {}).src;
    const path = rootRequire && scriptSource ? getCurrentPath(scriptSource) : currentPath;
    const url = `${window.location.origin}/${resolveRelativity(file, path)}`;

    if (isCached(url)) {
      return getFromCache(url);
    }

    try {
      const value = fetchSync(url);

      if (value === undefined) {
        cacheCall(url, undefined);
      } else {
        switch (extension) {
          case 'executable':
            cacheCall(url, getExports(require, url, value));
            break;
          case 'object':
            cacheCall(url, JSON.parse(value));
            break;
          // case 'style':
          //   document.head.appendChild(createElementAndSet('style', 'innerHTML', value));
          //   return value;
          default:
            cacheCall(url, value);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return undefined;
    }

    return getFromCache(url);
  };

  const rootPath = getCurrentPath(
    window.location.href.indexOf('/') === window.location.href.length - 1
      ? window.location.href.slice(0, window.location.href.length - 1)
      : window.location.href,
  );

  (window as ExtendedWindow).require = require.bind(window, true, rootPath);
}
