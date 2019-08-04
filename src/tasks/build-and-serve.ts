import { BuildConfig, GulpTaskPromise } from '../types';
import {
  rollup, watch as rollupWatch, openServer, removeFolder, createPreviewAppTo,
} from './common';

export const buildAndServe = (config: BuildConfig, watch: boolean = false): GulpTaskPromise => {
  const cleanup = removeFolder(config.paths.distFolder);
  const createPreviewApp = createPreviewAppTo(config.paths.distFolder);

  return async (): Promise<void> => {
    await cleanup();
    try {
      if (watch) {
        rollupWatch(config);
      } else {
        await rollup(config);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    createPreviewApp(config.serve.layoutFile);
    return watch ? openServer(config) : undefined;
  };
};
