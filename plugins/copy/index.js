const cpy = require("cpy");
const { resolver } = require("../../lib/api/common/resolver");
const { beforeBuildStart } = require("../helpers");
const glob = require('glob');

function globExists(globPath) {
  return glob.sync(globPath).length > 0;
}

function copyPlugin(pluginConfig) {
  // TODO watch files and trigger recompile
  // TODO do not flatten file paths when copying
  return beforeBuildStart(() => {
    const parsedConfig =
      typeof pluginConfig === "function" ? pluginConfig() : pluginConfig;
    
    return Promise.all(
      parsedConfig.filter(({ from }) => globExists(from)).map(async ({ from, to, ignore }) =>
        cpy(
          resolver([from], true).filter(
            file => !ignore || !ignore.some(ign => new RegExp(ign).test(file))
          ),
          to
        )
      )
    );
  });
}

module.exports = copyPlugin;
