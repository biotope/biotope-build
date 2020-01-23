
const removeEmptyPlugin = () => ({
  name: 'biotope-build-plugin-remove-empty',
  hook: 'before-emit',
  priority: 5,
  runner(_, builds) {
    builds.forEach((build) => {
      (build.warnings.EMPTY_BUNDLE || []).forEach((warning) => {
        if (warning.chunkName) {
          // eslint-disable-next-line no-param-reassign
          delete build.outputFiles[`${warning.chunkName}.js`];
        }
      });
    });
  },
});

module.exports = removeEmptyPlugin;
