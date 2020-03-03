import { resolve, sep } from 'path';
import { plugin as postcssPlugin } from 'postcss';
import * as autoprefixer from 'autoprefixer';
import { requireJson, safeName } from '../../../json-handlers';
import { ParsedOptions } from '../../../types';

interface Extractor {
  originalNames: string[];
  plugin: Function;
  getJSON: (_: string, __: Record<string, string>, ___: string) => void;
}

const classPrefix = `${safeName(requireJson<{ name: string }>(resolve(`${process.cwd()}/package.json`)).name)}--`;

const createExtractor = (
  localCss: Record<string, string>, originalNames: string[] = [],
): Extractor => ({
  originalNames,
  plugin: postcssPlugin('biotope-build-postcss-plugin-content-extractor', () => (root): void => {
    const result = root.toResult().css;
    if (root.source && root.source.input.file && result.indexOf(':export') === -1) {
      // eslint-disable-next-line no-param-reassign
      localCss[root.source.input.file] = result;
    }
  })(),
  getJSON: (filename: string, cssModules: Record<string, string>): void => {
    if (localCss[filename]) {
      Object.keys(cssModules)
        .filter((key) => !originalNames.includes(cssModules[key]))
        .forEach((key) => {
          // eslint-disable-next-line no-param-reassign
          localCss[filename] = localCss[filename].replace(new RegExp(`\\.${key}`, 'g'), `.${cssModules[key]}`);
        });
      // eslint-disable-next-line no-param-reassign
      cssModules.default = localCss[filename];
    }
  },
});

const resolveOS = (file: string): string => resolve(file).replace(new RegExp(sep, 'g'), '/');

export const postcss = (
  config: ParsedOptions, extracted: Record<string, string>, extractor = createExtractor(extracted),
): object => ({
  extensions: config.extStyle,
  extract: !!config.style.extract,
  inject: false,
  minimize: config.production,
  modules: config.style.modules ? {
    camelCase: true,
    generateScopedName(name: string, file: string, css: string): string {
      const { global, moduleExceptions } = config.style;
      const exceptionKey = Object
        .keys(moduleExceptions)
        .find((key) => resolveOS(key) === resolveOS(file));

      if (global || (exceptionKey && moduleExceptions[exceptionKey].includes(name))) {
        return name;
      }

      if (css.indexOf(`.${name}`) < 0) {
        extractor.originalNames.push(name);
        return name;
      }

      const path = safeName(file.replace(`${resolve(`${process.cwd()}/${config.project}`)}/`, ''));
      return `${config.production ? classPrefix : ''}${path}--${name}`;
    },
    getJSON: extractor.getJSON,
  } : false,
  plugins: [
    autoprefixer({ grid: 'autoplace' }),
    ...(config.style.modules ? [extractor.plugin] : []),
  ],
});
