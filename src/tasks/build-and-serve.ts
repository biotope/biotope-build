import { BuildConfig, GulpTaskPromise } from '../types';
import {
  rollup, watch as rollupWatch, openServer, removeFolder, createPreviewAppTo,
} from './common';

export const buildAndServe = (config: BuildConfig, connect?): GulpTaskPromise => {
  const cleanup = removeFolder(config.paths.distFolder);
  const createPreviewApp = createPreviewAppTo(config.paths.distFolder, connect);
  
  return async (): Promise<void> => {
    await cleanup();
    try {
      if (connect) {
        rollupWatch(config);
      } else {
        await rollup(config);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('ERROR: ', e);
    }
    
    createPreviewApp(config.serve.layoutFile);
    return connect ? openServer(config, connect) : null;
  };
};
