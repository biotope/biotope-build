import { resolve } from 'path';
import { sync as glob } from 'glob';
import * as typescript from 'rollup-plugin-typescript';
import * as rawNodeResolve from 'rollup-plugin-node-resolve';
import * as rawCommonjs from 'rollup-plugin-commonjs';
import * as scss from 'rollup-plugin-scss';
import * as babel from 'rollup-plugin-babel';

import { BuildConfig } from './config';

// FIXME: typings fix for "rollup-plugin-node-resolve" and "rollup-plugin-commonjs"
const nodeResolve: typeof rawNodeResolve.default = rawNodeResolve as any;
const commonjs: typeof rawCommonjs.default = rawCommonjs as any;

const getOutputName = (file) => {
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

const createInputObject = bundles => !Array.isArray(bundles)
  ? bundles
  : bundles.map(files => glob(files)).reduce((acc, files) => [
    ...acc,
    ...(typeof files === 'string' ? [files] : files),
  ], []).reduce((accumulator, file) => ({
    ...accumulator,
    [getOutputName(file)]: resolve(file),
  }), {});

const chunks = (vendorFolder, vendorChunks) => (path) => {
  const relativePath = path.replace(process.cwd(), '').split('/').filter(s => s).join('/');

  if (relativePath.includes('node_modules')) {
    const libPath = relativePath.replace('node_modules/', '');
    const lib = libPath.split('/').splice(0, libPath.indexOf('@') === 0 ? 2 : 1).join('/');

    if (vendorChunks.includes(lib)) {
      return `${vendorFolder}/${lib.split('/').join('-')}`;
    }

    return `${vendorFolder}/bundle`;
  }
  return;
};

const createBuild = ({ bundles, vendorChunks, paths, extensions }: BuildConfig) => ({
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
  manualChunks: chunks(paths.vendorFolder, vendorChunks),
});

const makeSafe = name => name.replace(/[&\/\\#,+()$~%.'":*?<>{}\s-]/g,'_').toLowerCase();

const createLegacyBuilds = (config: BuildConfig) => {
  const bundles = createInputObject(config.bundles);
  return Object.keys(bundles).map((output) => ({
    input: bundles[output],
    output: {
      format: 'iife',
      file: `${config.paths.distFolder}/${output}.legacy.js`,
      name: `${makeSafe(require(`${process.cwd()}/package.json`).name)}__${makeSafe(output)}`,
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

export default (config: BuildConfig) => ([
  createBuild(config),
  ...(config.legacy ? createLegacyBuilds(config) : []),
]);
