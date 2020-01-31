import { Options, ParsedOptionsConfig } from './types';

export const defaultCliOptions: Options = {
  config: '',
  project: 'src',
  exclude: 'resources',
  output: 'dist',
  copy: 'resources',
  maps: true,
  watch: false,
  production: false,
  debug: false,
  componentsJson: 'components\\/.*\\/index\\.(j|t)s$',
  extLogic: '.js,.ts',
  extStyle: '.css,.scss',
  legacy: false,
  serve: false,
  chunks: false,
};

export const defaultConfigs: ParsedOptionsConfig = {
  maps: {
    type: 'inline',
    environment: 'development',
  },
  legacy: {
    inline: true,
    suffix: '.legacy',
  },
  serve: {
    port: 8000,
    open: false,
    spa: false,
    secure: false,
  },
  chunks: {
    'biotope-element': ['@biotope/element'],
  },
  style: {
    extract: false,
    global: false,
    modules: true,
  },
  runtime: {},
};

export const defaultPlugins = [
  'logger',
  'runtime',
  'images',
  'copy',
  'components-json',
  'remove-empty',
  'serve',
  'livereload',
];
