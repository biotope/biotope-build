import { resolve } from 'path';
import { sync as glob } from 'glob';
import { rollup as runRollup, RollupOptions } from 'rollup';
import * as typescript from 'rollup-plugin-typescript';
import * as rawNodeResolve from 'rollup-plugin-node-resolve';
import * as rawCommonjs from 'rollup-plugin-commonjs';
import * as scss from 'rollup-plugin-scss';
import * as babel from 'rollup-plugin-babel';

import { BuildConfig, BundleConfig } from '../../types';

// FIXME: typings fix for "rollup-plugin-node-resolve" and "rollup-plugin-commonjs"
const nodeResolve: typeof rawNodeResolve.default = rawNodeResolve as any;
const commonjs: typeof rawCommonjs.default = rawCommonjs as any;

const getOutputName = (file: string): string => {
  let split = resolve(file).replace(process.cwd(), '').split('/').filter(s => s);
  if (split[0] === 'src') {
    const [ _, ...rest ] = split;
    split = rest;
  }
  const nameSplit = split[split.length - 1].split('.');
  nameSplit.pop();
  split[split.length - 1] = nameSplit.join('.');

  while (split.length > 1 && split[split.length - 1] === 'index') {
    split.pop();
  }
  return split.join('/');
};

const createInputObject = (bundles: BundleConfig): IndexObject<string> => !Array.isArray(bundles)
  ? bundles
  : bundles.map(files => glob(files)).reduce((acc, files) => [
    ...acc,
    ...(typeof files === 'string' ? [files] : files),
  ], []).reduce((accumulator, file) => ({
    ...accumulator,
    [getOutputName(file)]: resolve(file),
  }), {});

const manualChunks = (folder: string, chunks: string[]) => (path: string): string | undefined => {
  const relativePath = path.replace(process.cwd(), '').split('/').filter(s => s).join('/');

  if (relativePath.includes('node_modules')) {
    const libPath = relativePath.replace('node_modules/', '');
    const lib = libPath.split('/').splice(0, libPath.indexOf('@') === 0 ? 2 : 1).join('/');

    if (chunks.includes(lib)) {
      return `${folder}/${lib.split('/').join('-')}`;
    }

    return `${folder}/bundle`;
  }
  return;
};

const safeName = (name: string): string => name
  .replace(/[&\/\\#,+()$~%.'":*?<>{}\s-]/g,'_').toLowerCase();

const createBuild = ({ bundles, vendorChunks, paths, extensions }: BuildConfig): RollupOptions => ({
  input: createInputObject(bundles),
  output: {
    dir: paths.distFolder,
    format: 'esm',
    chunkFileNames: '[name].js',
  },
  plugins: [
    scss({ output: false }),
    typescript(),
    commonjs({ include: 'node_modules/**' }),
    nodeResolve({ browser: true, extensions }),
  ],
  manualChunks: manualChunks(paths.vendorFolder, vendorChunks),
});

const createLegacyBuilds = (config: BuildConfig): RollupOptions[] => {
  const bundles = createInputObject(config.bundles);
  return Object.keys(bundles).map((output) => ({
    input: bundles[output],
    output: {
      format: 'iife',
      file: `${config.paths.distFolder}/${output}.legacy.js`,
      name: `${safeName(require(`${process.cwd()}/package.json`).name)}__${safeName(output)}`,
    },
    plugins: [
      scss({ output: false }),
      babel({
        babelrc: false,
        extensions: config.extensions,
        presets: [
          ['@babel/env', {
            targets: {
              browsers: ["defaults", "ie >= 11"],
            },
          }],
          '@babel/typescript',
        ],
        plugins: [
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-transform-classes', { loose: true }],
        ],
      }),
      commonjs({ include: 'node_modules/**' }),
      nodeResolve({
        browser: true,
        extensions: config.extensions,
      }),
    ],
  }));
};

const createAllBuilds = (config: BuildConfig): RollupOptions[] => ([
  createBuild(config),
  ...(config.legacy ? createLegacyBuilds(config) : []),
]);

export const rollup = (config: BuildConfig) => Promise.all(
  createAllBuilds(config)
    .map(async rollupConfig => (await runRollup(rollupConfig)).write(rollupConfig.output)),
);
