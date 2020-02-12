import { Options, ParsedOptionsConfig } from './types';

export const defaultCliOptions: Options = {
  config: '',
  project: 'src',
  exclude: 'resources',
  output: 'dist',
  copy: 'resources,index.html',
  maps: true,
  watch: false,
  production: false,
  silent: false,
  ignoreResult: false,
  debug: false,
  componentsJson: false,
  extLogic: '.js,.mjs,.ts',
  extStyle: '.css,.scss',
  legacy: false,
  serve: false,
  chunks: false,
};

export const defaultConfigs: ParsedOptionsConfig = {
  componentsJson: 'components\\/.*\\/index\\.(j|t)s$',
  maps: {
    type: 'inline',
    environment: 'development',
  },
  legacy: {
    require: 'inline',
    suffix: '.legacy',
    only: false,
  },
  serve: {
    port: 8000,
    open: false,
    spa: false,
    secure: false,
  },
  style: {
    extract: false,
    extractName: 'index',
    global: false,
    modules: true,
  },
  chunks: {},
  alias: {},
  runtime: {},
};

export const defaultPlugins = [
  'logger',
  'runtime',
  'images',
  'copy',
  'append-extracted-css',
  'components-json',
  'remove-empty',
  'serve',
  'livereload',
];
