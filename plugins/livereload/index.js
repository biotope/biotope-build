const livereload = require('rollup-plugin-livereload');
const getPort = require('get-port');

const findPort = (port, range = 999) => getPort({
  port: getPort.makeRange(port, port + range),
});

const livereloadPlugin = () => {
  let isFirstTime = true;
  return [
    {
      name: 'biotope-build-plugin-livereload',
      hook: 'before-build',
      async runner({ output, serve }, [{ build }]) {
        if (!serve || serve.secure) {
          return;
        }
        const port = await findPort(35729);

        build.plugins.push(livereload({
          port,
          watch: output,
          verbose: false,
        }));
      },
    },
    {
      name: 'biotope-build-plugin-livereload',
      hook: 'after-emit',
      priority: -10,
      runner({ serve }) {
        if (isFirstTime && serve && serve.secure) {
          // eslint-disable-next-line no-console
          console.log('Liveload disabled due to serving https');
        }
        isFirstTime = false;
      },
    },
  ];
};

module.exports = livereloadPlugin;
