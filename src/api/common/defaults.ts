import { Options, ParsedOptionsConfig } from './types';

export const defaultCliOptions: Options = {
  config: '',
  project: 'src',
  exclude: 'resources',
  output: 'dist',
  copy: 'resources',
  watch: false,
  production: false,
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
};

export const defaultPlugins = ['serve', 'livereload', 'components-json', 'logger'];
