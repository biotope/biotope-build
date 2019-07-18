import { BuildConfig, defaultConfig } from './tasks/common/config';
import { series } from 'gulp';
import logBuildVersion from './tasks/common/version';
import createServeTask from './tasks/start';

const getConfig = (config) => ({
  ...defaultConfig,
  ...config,
});

export const createBuild = (config: BuildConfig = {}) => {
  const configuration = getConfig(config);
  console.log('createBuild:', configuration);

  return series(
    logBuildVersion,
  );
};

export const createServe = (config: BuildConfig = {}) => {
  const configuration = getConfig(config);
  console.log('createServe:', configuration);

  return series(
    logBuildVersion,
    createServeTask(configuration),
  );
}
