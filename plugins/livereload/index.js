const livereload = require('rollup-plugin-livereload');
const getPort = require('get-port');
const { beforeBuildStart } = require('../helpers');

const findPort = (port, range = 999) => getPort({
  port: getPort.makeRange(port, port + range),
});

function livereloadPlugin() {
  let port = 35729;
  return beforeBuildStart(async ({ output, serve }, builds) => {
    if (serve) {
      port = await findPort(port);

      builds[0].plugins.push(livereload({
        port,
        watch: output,
        verbose: false,
      }));
    }
  });
}

module.exports = livereloadPlugin;
