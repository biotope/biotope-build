import { BuildConfig, BuildTask } from './types';
import { defaultConfig } from './defaults';
import clean from './tasks/clean';
import createDistFolder from './tasks/createDistFolder';
import startLiveServer from './tasks/liveServer';
import setupPreviewApp from './tasks/previewApp';
import logVersion from './tasks/logVersion';
import bundle from './tasks/bundle';
import copy from './tasks/copy';


const getConfig = (config: Partial<BuildConfig>): BuildConfig => ({
  ...defaultConfig,
  ...config,
});

const defaultTasks: BuildTask[] = [
  logVersion,
  clean,
  createDistFolder,
  setupPreviewApp,
  startLiveServer,
  copy,
  bundle,
];

export const createBuild = (config: Partial<BuildConfig> = {}, watch: boolean): Function => {
  const configuration = getConfig(config || {});
  
  return async () => {
    for(const task of [...defaultTasks, ...configuration.plugins]) {
      try {
        await task(configuration, watch);
      } catch(e) {
        console.error(`Error in task:`,e);
      }
    }
  }
};
