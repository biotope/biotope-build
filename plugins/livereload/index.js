const livereload = require('rollup-plugin-livereload');
const synchronizedPromise = require('synchronized-promise');
const getPort = require('get-port');

const findPort = (port, range = 999) => synchronizedPromise(getPort)({
  port: getPort.makeRange(port, port + range),
});

function livereloadPlugin() {
  const port = 35729;
  return ['before-build', (config, builds) => {
    if (config.serve) {
      builds.forEach((build) => build.plugins.push(livereload({
        port: findPort(port),
        watch: config.output,
        verbose: false,
      })));
    }
  }];
}

module.exports = livereloadPlugin;
