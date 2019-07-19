import { server as connectServer, ConnectAppOptions } from 'gulp-connect';

import { BuildConfig } from '../../types';

// FIXME: Fix for "gulp-connect" incorrect typings
// eslint-disable-next-line prefer-destructuring
const server: (_?: ConnectAppOptions, __?: Function) => ConnectAppOptions = connectServer;

export const openServer = (config: BuildConfig): Promise<void> => new Promise(
  (resolve): ConnectAppOptions => server({
    root: config.paths.distFolder,
    livereload: true,
    port: config.serve.port,
  // eslint-disable-next-line func-names
  }, function (): void {
    this.server.on('close', resolve);
  }),
);
