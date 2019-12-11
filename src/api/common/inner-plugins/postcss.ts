import { plugin as postcssPlugin } from 'postcss';
import * as autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import { ParsedOptions } from '../types';

interface Extractor {
  getJSON: (_: string, __: Record<string, string>, ___: string) => void;
  plugin: Function;
}

const createExtractor = (localCSS: Record<string, string> = {}): Extractor => ({
  getJSON: (filename: string, json: Record<string, string>): void => {
    if (localCSS[filename]) {
      Object.keys(json).filter((key) => json[key][0] !== '#').forEach((key) => {
        // eslint-disable-next-line no-param-reassign
        localCSS[filename] = localCSS[filename].replace(new RegExp(`.${key}`, 'g'), `.${json[key]}`);
      });
      // eslint-disable-next-line no-param-reassign
      json.default = localCSS[filename];
    }
  },
  plugin: postcssPlugin('postcss-custom-content-extractor', () => (root): void => {
    const result = root.toResult().css;
    if (root.source && root.source.input.file && result.indexOf(':export') === -1) {
      // eslint-disable-next-line no-param-reassign
      localCSS[root.source.input.file] = result;
    }
  })(),
});

export const getPostcssConfig = (config: ParsedOptions, extractor = createExtractor()): object => ({
  extensions: config.extStyle,
  inject: false,
  minimize: config.production,
  modules: {
    camelCase: true,
    generateScopedName(name: string, file: string, css: string): string {
      const isClass = css.indexOf(`.${name}`) >= 0;
      const path = file
        .replace(`${resolve(`${process.cwd()}/${config.project}`)}/`, '')
        .replace(/[&#,+()$~%.'":*?<>{}\s-]/g, '-')
        .replace(/[/\\]/g, '_');

      return isClass ? `${path}_${name}` : `#${name}`;
    },
    getJSON: extractor.getJSON,
  },
  plugins: [
    autoprefixer({ grid: 'autoplace' }),
    extractor.plugin,
  ],
});
