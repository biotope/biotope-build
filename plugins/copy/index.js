const cpy = require('cpy');
const { sync: glob } = require('glob');
const chokidar = require('chokidar');
const { resolver } = require('../../lib/api/common/resolver');
const { saveConfig, beforeBuildStart } = require('../helpers');

function copyPlugin(pluginConfig) {
  const projectConfig = {};
  return [
    saveConfig(projectConfig),
    beforeBuildStart(() => {
      const list = (typeof pluginConfig === 'function' ? pluginConfig() : pluginConfig)
        .filter(({ from }) => glob(from).length > 0);

      return Promise.all(list.map(
        async ({ from, to, ignore }) => {
          const files = resolver([from], true)
            .filter((file) => !ignore.some((ign) => (new RegExp(ign)).test(file)));

          await cpy(files, to);
          if (projectConfig.watch) {
            chokidar.watch(files).on('all', async () => cpy(files, to));
          }
        },
      ));
    }),
  ];
}

module.exports = copyPlugin;
