const livereload = require('rollup-plugin-livereload');
const getPort = require('get-port');

const findPort = (port, range = 999) => getPort({
  port: getPort.makeRange(port, port + range),
});

function livereloadPlugin() {
  let port = 35729;
  return ['before-build', async (config, builds) => {
    if (config.serve) {
      port = await findPort(port);

      builds[0].plugins.push(livereload({
        port,
        watch: config.output,
        verbose: false,
      }));
    }
  }];
}

module.exports = livereloadPlugin;
