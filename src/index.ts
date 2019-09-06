import { BuildConfig } from './types';
import { logVersion, startLiveServer, setupPreviewApp, bundle, clean } from './tasks';
import { defaultConfig } from './defaults';

const getConfig = (config: Partial<BuildConfig>): BuildConfig => ({
  ...defaultConfig,
  ...config,
});

export const createBuild = (config?: Partial<BuildConfig>): Function => {
  const configuration = getConfig(config || {});
  
  return async () => {
    logVersion();
    await clean(configuration);
    await setupPreviewApp(configuration);
    await bundle(configuration);
  }
  // compileLoners();
  // copyResources();
  // copyDependencies();
};

export const createServe = (config?: Partial<BuildConfig>): Function => {
  const configuration = getConfig(config || {});

  console.log(configuration);
  
  return async () => {
    logVersion();
    await clean(configuration);
    startLiveServer(configuration);
    await setupPreviewApp(configuration);
    await bundle(configuration, true);
  }
};

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
