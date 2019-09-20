import { BuildConfig, BuildTask } from './types';
import { defaultConfig } from './defaults';
import clean from './tasks/clean';
import createDistFolder from './tasks/createDistFolder';
import startLiveServer from './tasks/liveServer';
import setupPreviewApp from './tasks/previewApp';
import logVersion from './tasks/logVersion';
import bundle from './tasks/bundle';


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
  bundle,
];

export const createBuild = (config: Partial<BuildConfig> = {}): Function => {
  const configuration = getConfig(config || {});
  
  return async () => {
    for(const task of [...defaultTasks, ...config.plugins]) {
      try {
        await task(configuration, false);
      } catch(e) {
        console.error(`Error in task:`,e);
      }
    }
  }
};

export const createServe = (config: Partial<BuildConfig> = {}): Function => {
  const configuration = getConfig(config || {});

  return async () => {
    for(const task of [...defaultTasks, ...config.plugins]) {
      try {
        await task(configuration, true);
      } catch(e) {
        console.error(`Error in task:`,e);
      }
    }
  }
};

// compileLoners();
  // copyResources();
  // copyDependencies();

// // Both
// Livereload
// Preview Server
// Log version
// postcss
// Scss compile
// uglify

// // New Projects
// Bundle

// // Old Projects
// stats
// Image Copy
// Iconfonts
// Scripts all
// Styles all
// JS Transpile
// TS Transpile
// move modules
