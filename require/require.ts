// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Require = (rootRequire: boolean, currentPath: string, file: string) => any;

interface WindowRequire extends Window {
  require?: Require;
}

type ExtensionType = 'executable' | 'object' | 'style';

if (!(window as WindowRequire).require) {
  const extensionTypes: Record<ExtensionType, string[]> = {
    executable: ['js'],
    object: ['json'],
    style: ['css'],
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

  const getExports = (requireFunction: Require, url: string, code: string): object => {
    const module: { exports: object } = { exports: {} };
    const newCurrentPath = getCurrentPath(url);
    const innerRequire = requireFunction.bind(window, false, newCurrentPath);
    // eslint-disable-next-line no-new-func
    (new Function('exports', 'require', 'module', '__filename', '__dirname', code))
      .call(window, module.exports, innerRequire, module, url, newCurrentPath);
    return module.exports;
  };

  const require: Require = (rootRequire: boolean, currentPath: string, file: string) => {
    const extension = toExtensionType(file.split('.').pop() as ExtensionType);
    const scriptSource = (lastOf<HTMLScriptElement>(document.querySelectorAll('script')) || {}).src;
    const path = rootRequire && scriptSource
      ? getCurrentPath(scriptSource)
        .split('/')
        .reverse()
        .slice(1)
        .reverse()
        .join('/')
      : currentPath;
    const url = `${window.location.origin}/${resolveRelativity(file, path)}`;

    try {
      const value = fetchSync(url);
      if (value === undefined) {
        return undefined;
      }
      switch (extension) {
        case 'executable':
          return getExports(require, url, value);
        case 'object':
          return JSON.parse(value);
        case 'style':
          document.head.appendChild(createElementAndSet('style', 'innerHTML', value));
          return value;
        default:
          return value;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return undefined;
    }
  };

  (window as WindowRequire).require = require.bind(window, true, getCurrentPath(
    window.location.href.indexOf('/') === window.location.href.length - 1
      ? window.location.href.slice(0, window.location.href.length - 1)
      : window.location.href,
  ));
}
