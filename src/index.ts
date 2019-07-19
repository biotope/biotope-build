import { series } from 'gulp';

import { BuildConfig } from './types';
import { logVersion, buildAndServe } from './tasks';
import { defaultConfig } from './defaults';

const getConfig = (config: Partial<BuildConfig>) => ({
  ...defaultConfig,
  ...config,
});

export const createBuild = (config?: Partial<BuildConfig>) => {
  const configuration = getConfig(config || {});

  return series(
    logVersion,
    buildAndServe(configuration),
  );
};

export const createServe = (config?: Partial<BuildConfig>) => {
  const configuration = getConfig(config || {});

  return series(
    logVersion,
    buildAndServe(configuration, true),
  );
}
