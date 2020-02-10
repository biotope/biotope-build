const chokidar = require('chokidar');
const { resolver } = require('../../lib/api/common/resolver');

const watchFilesPlugin = (pluginConfig = []) => {
  let isFirstTime = true;
  let files;
  return [
    {
      name: 'biotope-build-plugin-watch-files',
      hook: 'before-build',
      runner(projectConfig, builds) {
        if (!projectConfig.watch) {
          return;
        }
        files = resolver(typeof pluginConfig === 'function' ? pluginConfig(projectConfig, builds) : pluginConfig, true);
      },
    },
    {
      name: 'biotope-build-plugin-watch-files',
      hook: 'after-emit',
      runner(_, [{ triggerBuild }]) {
        if (isFirstTime && files) {
          chokidar.watch(files).on('change', () => triggerBuild());
        }
        isFirstTime = false;
      },
    },
  ];
};

module.exports = watchFilesPlugin;
