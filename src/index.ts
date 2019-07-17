import { BuildConfig, defaultConfig } from './config';
import { series } from 'gulp';
import logBuildVersion from './tasks/version';
import createStylesTask from './tasks/sass';
import createServeTask from './tasks/serve';

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