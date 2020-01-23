const { removeOutputFile } = require('../../lib/api/common/emit');

const removeEmptyPlugin = () => ({
  name: 'biotope-build-plugin-remove-empty',
  hook: 'before-emit',
  priority: 5,
  runner(_, builds) {
    builds.forEach((build) => {
      (build.warnings.EMPTY_BUNDLE || []).forEach((warning) => {
        if (warning.chunkName) {
          removeOutputFile(`${warning.chunkName}.js`, build.outputFiles);
        }
      });
    });
  },
});

module.exports = removeEmptyPlugin;
