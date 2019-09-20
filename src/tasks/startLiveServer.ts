import { BuildConfig, BuildTask } from './../types';
import * as liveServer from 'live-server';

export const startLiveServer: BuildTask = async (config: BuildConfig, isServing: boolean) => {
  if(isServing) {
    const params = {
        port: config.serve.port,
        host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: config.paths.distFolder, // Set root directory that's being served. Defaults to cwd.
        open: false, // When false, it won't load your browser by default.
        ignore: 'scss,my/templates', // comma-separated string for paths to ignore
        logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    };
  
    liveServer.start(params);
  }
}