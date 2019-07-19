import { BuildConfig } from '../types';
import { rollup, openServer, removeFolder, createPreviewAppTo } from './common';

export const buildAndServe = (config: BuildConfig, watch: boolean = false) => {
  const cleanup = removeFolder(config.paths.distFolder);
  const createPreviewApp = createPreviewAppTo(config.paths.distFolder);

  if (watch) {
    console.log('TODO: watch files');
  }

  return async () => {
    await cleanup();
    await rollup(config);
    createPreviewApp(config.serve.layoutFile);
    return openServer(config);
  };
}
