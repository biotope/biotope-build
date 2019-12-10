import { resolve } from 'path';
import { readFileSync } from 'fs';
import { RollupOptions, ManualChunksOption } from 'rollup';
import { plugin as postcssPlugin } from 'postcss';
import * as rawTypescript from 'rollup-plugin-typescript2';
import * as rawNodeResolve from 'rollup-plugin-node-resolve';
import * as rawCommonjs from 'rollup-plugin-commonjs';
import * as postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import * as copy from 'rollup-plugin-copy-glob';
import * as autoprefixer from 'autoprefixer';
import * as babel from 'rollup-plugin-babel';
import * as babelPresetEnv from '@babel/preset-env';
import * as babelPresetTypescript from '@babel/preset-typescript';
import * as babelPluginProposalClassProperties from '@babel/plugin-proposal-class-properties';
import * as babelPluginTransformClasses from '@babel/plugin-transform-classes';
import * as babelPluginTransformObjectAssign from '@babel/plugin-transform-object-assign';
import { ParsedOptions, LegacyOptions, PreRollupOptions } from './types';
import { resolver } from './resolver';

// FIXME: typings fix for all these packages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeResolve: typeof rawNodeResolve.default = rawNodeResolve as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commonjs: typeof rawCommonjs.default = rawCommonjs as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typescript: typeof rawTypescript.default = rawTypescript as any;

const plugins = {
  postcss,
  copy,
  terser,
  babel,
  typescript,
  commonjs,
  nodeResolve,
};

const TYPESCRIPT_ES6_CONFIG = {
  compilerOptions: {
    target: 'es6',
  },
};

const requirePath = resolve(`${__dirname}/../../require.min.js`);

const getOutputName = (file: string, folder: string): string => {
  const split = file.replace(resolve(`${process.cwd()}${folder ? `/${folder}` : ''}`), '')
    .split('/')
    .filter((slug): boolean => !!slug);

  const nameSplit = split[split.length - 1].split('.');
  nameSplit.pop();
  split[split.length - 1] = nameSplit.join('.');

  while (split.length > 1 && split[split.length - 1] === 'index') {
    split.pop();
  }
  return split.join('/');
};

const createInputObject = (
  folder: string, extensions: string[], suffix: string, excludes: string[],
): Record<string, string> => (
  resolver(extensions, [folder]).reduce((accumulator, files) => ([
    ...accumulator,
    ...(typeof files === 'string' ? [files] : files),
  ]), []).reduce((accumulator, file): Record<string, string> => ({
    ...accumulator,
    ...(excludes.indexOf(resolve(file)) >= 0 ? {} : {
      [`${getOutputName(file, folder)}${suffix}`]: resolve(file),
    }),
  }), {})
);

const invertObject = (vendors: Record<string, string[]>): Record<string, string> => Object
  .keys(vendors)
  .reduce((accumulator, name): Record<string, string> => ({
    ...accumulator,
    ...(vendors[name].reduce((acc, vendor): Record<string, string> => ({
      ...acc,
      [vendor]: name,
    }), {})),
  }), {});

const manualChunks = (
  folder: string, chunks: Record<string, string[]>, legacy: false | LegacyOptions,
): ManualChunksOption => {
  const invertedChunks = invertObject(chunks);
  const invertedChunksKeys = Object.keys(invertedChunks);

  return (path: string): string | undefined => {
    const relativePath = path
      .replace(process.cwd(), '')
      .split('/')
      .filter((slug): boolean => !!slug)
      .join('/');

    if (relativePath.includes('node_modules')) {
      const libPath = relativePath.slice(relativePath.indexOf('node_modules/') + 'node_modules/'.length);
      const lib = libPath.split('/').splice(0, libPath.indexOf('@') === 0 ? 2 : 1).join('/');

      if (invertedChunksKeys.includes(lib)) {
        return `${folder}/${invertedChunks[lib].split('/').join('-')}${legacy ? legacy.suffix : ''}`;
      }

      return `${folder}/bundle${legacy ? legacy.suffix : ''}`;
    }
    return undefined;
  };
};

interface Extractor {
  getJSON: (_: string, __: Record<string, string>, ___: string) => void;
  plugin: Function;
}

const createExtractor = (localCSS: Record<string, string> = {}): Extractor => ({
  getJSON: (filename: string, json: Record<string, string>): void => {
    if (localCSS[filename]) {
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

const createBuild = (
  config: ParsedOptions, legacy: boolean, { getJSON, plugin }: Extractor = createExtractor(),
): PreRollupOptions => ({
  input: createInputObject(
    config.project,
    config.extLogic,
    legacy ? (config.legacy as LegacyOptions).suffix : '',
    resolver(config.extLogic, config.exclude.map((folder) => `${config.project}/${folder}`)),
  ),
  output: {
    dir: config.output,
    format: !legacy ? 'esm' : 'cjs',
    chunkFileNames: '[name].js',
    banner: legacy && (config.legacy as LegacyOptions).inline
      ? readFileSync(requirePath).toString()
      : '',
    sourcemap: !config.production,
  },
  plugins: [],
  pluginsConfig: {
    postcss: [{
      extensions: config.extStyle,
      inject: false,
      minimize: config.production,
      modules: {
        camelCase: true,
        generateScopedName: '[path]__[name]__[local]--[hash:base64:5]',
        getJSON,
      },
      plugins: [
        autoprefixer({ grid: 'autoplace' }),
        plugin,
      ],
    }],
    commonjs: [{
      include: 'node_modules/**',
    }],
    nodeResolve: [{
      browser: true,
      extensions: config.extLogic,
    }],
    ...(!legacy ? {
      typescript: [{
        // eslint-disable-next-line global-require
        typescript: require('typescript'),
        tsconfigOverride: TYPESCRIPT_ES6_CONFIG,
      }],
    } : {
      babel: [{
        babelrc: false,
        extensions: config.extLogic,
        presets: [
          babelPresetEnv,
          babelPresetTypescript,
        ],
        plugins: [
          [babelPluginProposalClassProperties, { loose: true }],
          [babelPluginTransformClasses, { loose: true }],
          babelPluginTransformObjectAssign,
        ],
      }],
    }),
    ...(config.production ? { terser: [] } : {}),
    copy: [
      [
        ...config.copy.map((folder) => ({
          files: `${config.project}/${folder}/**/*`,
          dest: `${config.output}/${folder}`,
        })),
        ...(legacy && !(config.legacy as LegacyOptions).inline
          ? [{ files: requirePath, dest: config.output }]
          : []),
      ],
      { watch: config.watch },
    ],
  },
  manualChunks: manualChunks('vendor', config.chunks || {}, legacy ? config.legacy as LegacyOptions : false),
});

export const createAllBuilds = (config: ParsedOptions): PreRollupOptions[] => ([
  createBuild(config, false),
  ...(config.legacy ? [createBuild(config, true)] : []),
]);

export const finalizeBuilds = (builds: PreRollupOptions[]): RollupOptions[] => builds
  .reduce((accumulator, build) => ([...accumulator, Object.keys(build).reduce((acc, key) => ({
    ...acc,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(key !== 'pluginsConfig' ? { [key]: (build as Record<string, any>)[key] } : {}),
    ...(key === 'pluginsConfig' ? {
      plugins: [
        ...Object.keys(build.pluginsConfig)
          .filter((pluginName) => Array.isArray(build.pluginsConfig[pluginName]))
          .map((pluginName) => plugins[
            pluginName as keyof typeof plugins
          ](...build.pluginsConfig[pluginName])),
        ...(build.plugins || []),
      ],
    } : {}),
  }), {})]), []);
