import { resolve, sep } from 'path';
import { plugin as postcssPlugin, Declaration, Plugin } from 'postcss';
import * as autoprefixer from 'autoprefixer';
import { requireJson, safeName } from '../../../json-handlers';
import { ParsedOptions } from '../../../types';

const EXTRACTOR_PROP_NAME = 'default';

const classPrefix = `${safeName(requireJson<{ name: string }>(resolve(`${process.cwd()}/package.json`)).name)}--`;

const createExtractor = (localCss: Record<string, string>): Plugin<undefined> => postcssPlugin(
  'biotope-build-postcss-plugin-content-extractor',
  () => (root): void => {
    root.walkRules((rule) => {
      if (rule.selector === ':export' && rule.nodes) {
        let value = root.toResult().css;
        value = value.substr(0, value.indexOf(':export {'));

        rule.nodes.push({ type: 'decl', prop: EXTRACTOR_PROP_NAME, value } as Declaration);

        if (root.source && root.source.input.file) {
          // eslint-disable-next-line no-param-reassign
          localCss[root.source.input.file] = value;
        }
      }
    });
  },
);

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
        return name;
      }

      const path = safeName(file.replace(`${resolve(`${process.cwd()}${sep}${config.project}`)}${sep}`, ''));
      return `${config.production ? classPrefix : ''}${path}--${name}`;
    },
  } : false,
  plugins: [
    autoprefixer({ grid: 'autoplace' }),
    ...(config.style.modules ? [extractor] : []),
  ],
});
