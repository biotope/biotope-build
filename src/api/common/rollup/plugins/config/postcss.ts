import { resolve, sep } from 'path';
import {
  plugin as postcssPlugin, decl, rule, Plugin, Declaration, Rule, Root, ChildNode,
} from 'postcss';
import * as autoprefixer from 'autoprefixer';
import { requireJson, safeName } from '../../../json-handlers';
import { ParsedOptions } from '../../../types';

const EXTRACTOR_PROP_NAME = 'default';

const classPrefix = `${safeName(requireJson<{ name: string }>(resolve(`${process.cwd()}/package.json`)).name)}--`;

const getExportRule = (root: Root): Rule => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let exportRule: any;
  root.walkRules((rootRule) => {
    if (rootRule.selector === ':export') {
      exportRule = rootRule;
    }
  });
  if (!exportRule) {
    if (!root.nodes) {
      // eslint-disable-next-line no-param-reassign
      root.nodes = [];
    }
    exportRule = rule({ selector: ':export' });
    root.nodes.push(exportRule);
  }
  if (!exportRule.nodes) {
    exportRule.nodes = [];
  }
  return exportRule as Rule;
};

const getCss = (root: Root): string => {
  const rootCss = root.toResult().css;
  const exportsIndex = rootCss.indexOf(':export {');
  return exportsIndex >= 0 ? rootCss.substr(0, exportsIndex) : rootCss;
};

const createExtractor = (localCss: Record<string, string>): Plugin<undefined> => postcssPlugin(
  'biotope-build-postcss-plugin-content-extractor',
  () => {
    const parsedInputs: string[] = [];

    return (root): void => {
      if (
        !root.source
        || !root.source.input.file
        || parsedInputs.indexOf(root.source.input.file) >= 0
      ) {
        return;
      }

      const exportRule = getExportRule(root);
      const value = getCss(root);

      (exportRule.nodes as ChildNode[]).push(decl({
        prop: EXTRACTOR_PROP_NAME,
        value,
        parent: exportRule,
      } as Declaration));

      // eslint-disable-next-line no-param-reassign
      localCss[root.source.input.file] = value;

      parsedInputs.push(root.source.input.file);
    };
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
    localsConvention: 'camelCase',
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
