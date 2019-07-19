import { resolve } from 'path';
import { sync as glob } from 'glob';
import { rollup as runRollup, RollupOptions, RollupOutput } from 'rollup';
import * as typescript from 'rollup-plugin-typescript';
import * as rawNodeResolve from 'rollup-plugin-node-resolve';
import * as rawCommonjs from 'rollup-plugin-commonjs';
import * as scss from 'rollup-plugin-scss';
import * as babel from 'rollup-plugin-babel';

import { BuildConfig, BundleConfig } from '../../types';

// FIXME: typings fix for "rollup-plugin-node-resolve" and "rollup-plugin-commonjs"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeResolve: typeof rawNodeResolve.default = rawNodeResolve as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commonjs: typeof rawCommonjs.default = rawCommonjs as any;

const getOutputName = (file: string): string => {
  let split = resolve(file).replace(process.cwd(), '').split('/').filter((slug): boolean => !!slug);
  if (split[0] === 'src') {
    split = split.slice(1);
  }
  const nameSplit = split[split.length - 1].split('.');
  nameSplit.pop();
  split[split.length - 1] = nameSplit.join('.');

  while (split.length > 1 && split[split.length - 1] === 'index') {
    split.pop();
  }
  return split.join('/');
};

const createInputObject = (bundles: BundleConfig): IndexObject<string> => (!Array.isArray(bundles)
  ? bundles
  : bundles.map((files): string[] => glob(files)).reduce((acc, files): string[] => [
    ...acc,
    ...(typeof files === 'string' ? [files] : files),
  ], []).reduce((accumulator, file): IndexObject<string> => ({
    ...accumulator,
    [getOutputName(file)]: resolve(file),
  }), {}));

const manualChunks = (folder: string, chunks: string[]): (_: string) => string | undefined => (
  path: string,
): string => {
  const relativePath = path
    .replace(process.cwd(), '')
    .split('/')
    .filter((slug): boolean => !!slug).join('/');

  if (relativePath.includes('node_modules')) {
    const libPath = relativePath.replace('node_modules/', '');
    const lib = libPath.split('/').splice(0, libPath.indexOf('@') === 0 ? 2 : 1).join('/');

    if (chunks.includes(lib)) {
      return `${folder}/${lib.split('/').join('-')}`;
    }

    return `${folder}/bundle`;
  }
  return undefined;
};

const safeName = (name: string): string => name
  .replace(/[&/\\#,+()$~%.'":*?<>{}\s-]/g, '_').toLowerCase();

const createBuild = ({
  bundles, vendorChunks, paths, extensions,
}: BuildConfig): RollupOptions => ({
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
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const packageName = require(`${process.cwd()}/package.json`).name;

  return Object.keys(bundles).map((output): RollupOptions => ({
    input: bundles[output],
    output: {
      format: 'iife',
      file: `${config.paths.distFolder}/${output}.legacy.js`,
      name: `${safeName(packageName)}__${safeName(output)}`,
    },
    plugins: [
      scss({ output: false }),
      babel({
        babelrc: false,
        extensions: config.extensions,
        presets: [
          ['@babel/env', {
            targets: {
              browsers: ['defaults', 'ie >= 11'],
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

export const rollup = (config: BuildConfig): Promise<RollupOutput[]> => Promise.all(
  createAllBuilds(config).map(
    async (rollupConfig): Promise<RollupOutput> => (await runRollup(rollupConfig))
      .write(rollupConfig.output),
  ),
);
