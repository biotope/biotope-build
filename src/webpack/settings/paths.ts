import { resolve } from 'path';
import * as mergeDeep from 'merge-deep';

import { Options, Settings } from './types';

const pathDefaults = {
  app: './src/',
  assetsRelative: 'assets/',
  bundlesRelative: 'bundles/',
  dist: './dist/',
  buildRelative: 'build/',
};

const baseAbsolute = resolve('./');

export const getPaths = (paths: Options['paths'] = {}): Settings['paths'] => {
  const pathsDefined = mergeDeep(pathDefaults, paths) as Settings['paths'];
  return {
    ...pathsDefined,
    server: '/',
    baseAbsolute,
    appAbsolute: resolve(`${baseAbsolute}/${pathsDefined.app}`),
    assetsAbsolute: resolve(`${baseAbsolute}/${pathsDefined.app}/${pathsDefined.assetsRelative}`),
    bundlesAbsolute: resolve(`${baseAbsolute}/${pathsDefined.app}/${pathsDefined.bundlesRelative}`),
    distAbsolute: resolve(`${baseAbsolute}/${pathsDefined.dist}`),
    buildAbsolute: resolve(`${baseAbsolute}/${pathsDefined.dist}/${pathsDefined.buildRelative}`),
  };
};
