import * as LocalWebServer from 'local-web-server';
import * as os from 'os';
import * as reduceFlatten from 'reduce-flatten';

const PORT = 8000;

export interface ServeOptions {
  directory?: string;
  open?: boolean;
  production?: boolean;
  spa?: boolean;
}

export const serve = (options: ServeOptions): void => {
  (new LocalWebServer()).listen({
    port: PORT,
    https: options.production,
    compress: options.production,
    directory: options.directory || 'dist',
    spa: options.spa ? 'index.html' : undefined,
  });

  const ipList = Object.keys(os.networkInterfaces())
    .map(key => os.networkInterfaces()[key])
    .reduce(reduceFlatten, [])
    .filter(networkInterface => networkInterface.family === 'IPv4')
    .map(networkInterface => networkInterface.address);

  ipList.unshift(os.hostname());
  const urls = ipList.map(address => `http${options.production ? 's' : ''}://${address}:${PORT}`);

  // eslint-disable-next-line no-console
  console.log(`Serving at ${urls.join(', ')}`);

  if (options.open) {
    // eslint-disable-next-line global-require
    require('opn')(urls[1]);
  }
};
