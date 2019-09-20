import { resolve } from 'path';
import * as path from 'path';
import { sync as glob } from 'glob';
import {
  rollup as runRollup,
  watch as runWatch,
  RollupOptions,
  RollupOutput,
  ManualChunksOption,
  RollupWatcher,
} from 'rollup';
import * as typescript from 'rollup-plugin-typescript';
import * as rawNodeResolve from 'rollup-plugin-node-resolve';
import * as rawCommonjs from 'rollup-plugin-commonjs';
import * as postcss from 'rollup-plugin-postcss';
import * as babel from 'rollup-plugin-babel';
import * as autoprefixer from 'autoprefixer';
import * as babelPluginProposalClassProperties from '@babel/plugin-proposal-class-properties';
import * as babelPluginTransformClasses from '@babel/plugin-transform-classes';
import * as babelPresetTypescript from '@babel/preset-typescript';

import { BuildConfig, BundleConfig, VendorConfig } from '../types';

// FIXME: typings fix for "rollup-plugin-node-resolve" and "rollup-plugin-commonjs"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeResolve: typeof rawNodeResolve.default = rawNodeResolve as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commonjs: typeof rawCommonjs.default = rawCommonjs as any;

const onwarn = warning => {
  // Silence circular dependency warning for moment package
  if (
    warning.code === 'CIRCULAR_DEPENDENCY'
    && !warning.importer.indexOf(path.normalize('src'))
  ) {
    return
  }

  console.warn(`(!) ${warning.message}`)
}


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
  : bundles.map((files): string[] => glob(files)).reduce((accumulator, files): string[] => ([
    ...accumulator,
    ...(typeof files === 'string' ? [files] : files),
  ]), []).reduce((accumulator, file): IndexObject<string> => ({
    ...accumulator,
    [getOutputName(file)]: resolve(file),
  }), {}));

const createVendorObject = (vendors: VendorConfig): IndexObject<string[]> => (
  !Array.isArray(vendors) ? vendors : vendors
    .reduce((accumulator, vendor): IndexObject<string[]> => ({
      ...accumulator,
      [vendor]: [vendor],
    }), {})
);

const invertObject = (vendors: VendorConfig): IndexObject<string> => Object
  .keys(vendors)
  .reduce((accumulator, name): IndexObject<string> => ({
    ...accumulator,
    ...(vendors[name].reduce((acc, vendor): IndexObject<string> => ({
      ...acc,
      [vendor]: name,
    }), {})),
  }), {});

const manualChunks = (folder: string, chunks: IndexObject<string[]>): ManualChunksOption => (
  path: string,
): string => {
  const relativePath = path
    .replace(process.cwd(), '')
    .split('/')
    .filter((slug): boolean => !!slug).join('/');

  if (relativePath.includes('node_modules')) {
    const libPath = relativePath.slice(relativePath.indexOf('node_modules/') + 'node_modules/'.length);
    const lib = libPath.split('/').splice(0, libPath.indexOf('@') === 0 ? 2 : 1).join('/');

    const invertedChunks = invertObject(chunks);
    if (Object.keys(invertedChunks).includes(lib)) {
      return `${folder}/${invertedChunks[lib].split('/').join('-')}`;
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
  onwarn,
  output: {
    dir: paths.distFolder,
    format: 'esm',
    chunkFileNames: '[name].js',
  },
  plugins: [
    postcss({
      extensions: ['.css', '.scss'],
      inject: false,
      plugins: [
        autoprefixer(),
      ],
    }),
    typescript(),
    commonjs({ 
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    nodeResolve({ browser: true, extensions }),
  ],
  manualChunks: manualChunks(paths.vendorFolder, createVendorObject(vendorChunks)),
});

const createLegacyBuilds = (config: BuildConfig): RollupOptions[] => {
  const bundles = createInputObject(config.bundles);
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const packageName = require(`${process.cwd()}/package.json`).name;

  return Object.keys(bundles).map((output): RollupOptions => ({
    input: bundles[output],
    onwarn,
    output: {
      format: 'iife',
      file: `${config.paths.distFolder}/${output}.legacy.js`,
      name: `${safeName(packageName)}__${safeName(output)}`,
    },
    plugins: [
      postcss({
        extensions: ['.css', '.scss'],
        inject: false,
        plugins: [
          autoprefixer(),
        ],
      }),
      babel({
        babelrc: false,
        extensions: config.extensions,
        presets: [
          ['@babel/env', {
            targets: {
              browsers: ['defaults', 'ie >= 11'],
            },
          }],
          babelPresetTypescript,
        ],
        plugins: [
          [babelPluginProposalClassProperties, { loose: true }],
          [babelPluginTransformClasses, { loose: true }],
        ],
      }),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
          'node_modules/react-dom/index.js': ['render']
        }
      }),
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

export const rollupWatch = (config: BuildConfig): RollupWatcher => runWatch(
  createAllBuilds(config),
);

export const rollup = (config: BuildConfig): Promise<RollupOutput[]> => Promise.all(
  createAllBuilds(config).map(
    async (rollupConfig): Promise<RollupOutput> => (await runRollup(rollupConfig))
      .write(rollupConfig.output),
  ),
);
