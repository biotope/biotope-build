import { resolve } from 'path';
import { sync as glob } from 'glob';
import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import scss from 'rollup-plugin-scss';

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

const createBuild = ({ bundles, vendorChunks, paths }) => ({
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
    nodeResolve({ browser: true }),
  ],
  manualChunks: chunks(paths.vendorFolder, vendorChunks),
});

const createLegacyBuilds = (config) => {
  const bundles = createInputObject(config.bundles);
  return Object.keys(bundles).map((output) => ({
    input: bundles[output],
    output: {
      format: 'iife',
      file: `${config.paths.distFolder}/${output}.legacy.js`,
      name: bundles[output],
    },
    plugins: [
      scss({ output: false }),
      typescript(),
      commonjs({ include: 'node_modules/**' }),
      nodeResolve({ browser: true }),
    ],
  }));
};

const config = require('./biotope-build.config');

module.exports = [
  createBuild(config),
  ...createLegacyBuilds(config),
];
