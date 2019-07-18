import { BuildConfig } from "../common/config";
import * as connect from 'gulp-connect';

const openServer = (config: BuildConfig) => new Promise(resolve => {
  connect.server({
    root: config.paths.distFolder,
    livereload: true,
    port: config.serve.port,
  }, function () { this.server.on('close', resolve) });
});

export default openServer;
