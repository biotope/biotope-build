import { Options, ParsedOptionsConfig } from './types';

export const defaultCliOptions: Options = {
  config: '',
  project: 'src',
  exclude: 'resources',
  output: 'dist',
  copy: 'resources',
  watch: false,
  production: false,
  componentsJson: 'components\\/.*\\/index\\.(j|t)s$',
  extLogic: '.js,.ts',
  extStyle: '.css,.scss',
  legacy: false,
  serve: false,
  chunks: false,
};

export const defaultConfigs: ParsedOptionsConfig = {
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
  },
  runtime: {},
};

export const defaultPlugins = [
  'serve', 'livereload', 'logger', 'images', 'runtime', 'copy', 'components-json',
];
