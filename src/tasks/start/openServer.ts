import { ServeConfig } from "../common/config";
import * as connect from 'gulp-connect';

const openServer = (config: ServeConfig) => new Promise(res => {
  connect.server({
    root: config.tempFolder,
    livereload: true,
    port: config.port,
  }, function () { this.server.on('close', res) })
});

export default openServer;