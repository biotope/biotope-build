
const removeEmptyPlugin = () => ({
  name: 'biotope-build-plugin-remove-empty',
  hook: 'before-emit',
  priority: 5,
  runner(_, builds) {
    builds.forEach(({ warnings, outputFiles }) => {
      (warnings.EMPTY_BUNDLE || []).forEach((warning) => {
        if (warning.chunkName) {
          builds.removeFile(`${warning.chunkName}.js`, outputFiles);
        }
      });
    });
  },
});

module.exports = removeEmptyPlugin;
