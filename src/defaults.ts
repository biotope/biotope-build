import { BuildConfig } from './types';

export const defaultConfig: BuildConfig = {
  bundles: [
    './src/**/*.js',
    './src/**/*.ts',
  ],
  vendorChunks: {
    'biotope-element': [
      '@biotope/element',
    ],
  },
  paths: {
    distFolder: 'dist',
    vendorFolder: 'vendor',
  },
  extensions: ['.js', '.ts'],
  serve: {
    port: 9000,
    layoutFile: 'preview/index.ejs',
  },
  legacy: true,
  plugins: []
};
