import * as connect from 'gulp-connect';

import { BuildConfig } from '../../types';

// FIXME: Fix for "gulp-connect" incorrect typings
const server: (_?: connect.ConnectAppOptions, __?: Function) => connect.ConnectAppOptions = connect.server;

export const openServer = (config: BuildConfig) => new Promise<void>(resolve => server({
  root: config.paths.distFolder,
  livereload: true,
  port: config.serve.port,
}, function () {
  this.server.on('close', resolve);
}));
