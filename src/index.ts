import { BuildConfig, defaultConfig } from './tasks/common/config';
import { series } from 'gulp';
import logBuildVersion from './tasks/version';
import createStylesTask from './tasks/build/sass';
import createServeTask from './tasks/start';

export const createBuild = (config: BuildConfig = {}) => {
  const defaultedConfig = {
    ...defaultConfig,
    ...config
  };
  console.log(defaultedConfig);
  
  return series(
    logBuildVersion,
    createStylesTask(defaultedConfig.sass)
  )
}

export const createServe = (config: BuildConfig) => {
  const defaultedConfig = {
    ...defaultConfig,
    ...config
  };

  return series(
    logBuildVersion,
    createServeTask(defaultedConfig.serve)
  )
}