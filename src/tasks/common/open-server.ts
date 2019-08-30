import { BuildConfig } from '../../types';

// FIXME: Fix for "gulp-connect" incorrect typings
// eslint-disable-next-line prefer-destructuring

export const openServer = (config: BuildConfig, connect): Promise<void> => new Promise(
  (resolve) => connect.server({
    root: config.paths.distFolder,
    livereload: true,
    port: config.serve.port,
  // eslint-disable-next-line func-names
  }, function (): void {
    this.server.on('close', resolve);
  }),
);
