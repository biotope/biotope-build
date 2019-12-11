const cpy = require('cpy');
const { resolver } = require('../../lib/api/common/resolver');
const { beforeBuildStart } = require('../helpers');

function copyPlugin(pluginConfig) {
  // TODO watch files and trigger recompile
  // TODO do not flatten file paths when copying
  return beforeBuildStart(() => {
    const parsedConfig = typeof pluginConfig === 'function' ? pluginConfig() : pluginConfig;

    return Promise.all(parsedConfig.map(
      async ({ from, to, ignore }) => cpy(
        resolver([from], true)
          .filter((file) => !ignore.some((ign) => (new RegExp(ign)).test(file))),
        to,
      ),
    ));
  });
}

module.exports = copyPlugin;
