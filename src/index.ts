import { series, TaskFunction } from 'gulp';

import { BuildConfig } from './types';
import { logVersion, buildAndServe } from './tasks';
import { defaultConfig } from './defaults';
import * as connect from 'gulp-connect';

const getConfig = (config: Partial<BuildConfig>): BuildConfig => ({
  ...defaultConfig,
  ...config,
});

export const createBuild = (config?: Partial<BuildConfig>): TaskFunction => {
  const configuration = getConfig(config || {});

  return series(
    logVersion,
    buildAndServe(configuration),
  );
};

export const createServe = (config?: Partial<BuildConfig>): TaskFunction => {
  const configuration = getConfig(config || {});

  return series(
    logVersion,
    buildAndServe(configuration, connect),
  );
};
