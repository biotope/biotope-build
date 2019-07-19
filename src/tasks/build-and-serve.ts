import { BuildConfig, GulpTaskPromise } from '../types';
import {
  rollup, openServer, removeFolder, createPreviewAppTo,
} from './common';

export const buildAndServe = (config: BuildConfig, watch: boolean = false): GulpTaskPromise => {
  const cleanup = removeFolder(config.paths.distFolder);
  const createPreviewApp = createPreviewAppTo(config.paths.distFolder);

  if (watch) {
    // eslint-disable-next-line no-console
    console.log('TODO: watch files');
  }

  return async (): Promise<void> => {
    await cleanup();
    try {
      await rollup(config);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    createPreviewApp(config.serve.layoutFile);
    return openServer(config);
  };
};
