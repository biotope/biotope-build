const os = require('os');
const LocalWebServer = require('local-web-server');
const opn = require('open');
const getPort = require('get-port');

const flatten = (array, current) => {
  if (Array.isArray(current)) {
    array.push(...current);
  } else {
    array.push(current);
  }
  return array;
};

const findPort = (port, range = 999) => getPort({
  port: getPort.makeRange(port, port + range),
});

const findHosts = () => {
  const ipList = Object.keys(os.networkInterfaces())
    .map((key) => os.networkInterfaces()[key])
    .reduce(flatten, [])
    .filter((networkInterface) => networkInterface.family === 'IPv4')
    .map((networkInterface) => networkInterface.address);

  ipList.unshift(os.hostname());
  return ipList;
};

const createServer = (directory, port, open, spa, https) => {
  LocalWebServer.create({
    port,
    https,
    directory,
    compress: true,
    spa: spa ? 'index.html' : undefined,
  });

  const urls = findHosts()
    .map((host) => `http${https ? 's' : ''}://${host}${port === 80 ? '' : `:${port}`}`);

  // eslint-disable-next-line no-console
  console.log(`Serving at ${urls.join(' ')}\n`);

  if (open) {
    opn(urls[0]);
  }
};

const servePlugin = (pluginOptions = {}) => {
  let isFirstTime = true;
  return {
    name: 'biotope-build-plugin-serve',
    hook: 'after-emit',
    priority: -10,
    async runner({ serve, output }) {
      const { open, spa, secure } = pluginOptions;

      if (isFirstTime && serve) {
        isFirstTime = false;
        const port = await findPort(pluginOptions.port || 8000);
        createServer(output || 'dist', port, open || false, spa || false, secure || false);
      }
    },
  };
};

module.exports = servePlugin;
