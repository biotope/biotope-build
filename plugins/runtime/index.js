const { beforeBuildStart } = require('../helpers');
const { getRuntime, getRuntimeJavascript, getRuntimeSass } = require('./runtime');
const { getPrependConfig, prepend } = require('./prepend');

function runtimePlugin() {
  return [
    beforeBuildStart((projectConfig, builds) => {
      const logicPrepend = getPrependConfig(
        getRuntimeJavascript(getRuntime(projectConfig)),
        projectConfig.extLogic,
      );
      const stylePrepend = getPrependConfig(
        getRuntimeSass(getRuntime(projectConfig)),
        projectConfig.extStyle,
      );

      builds.forEach((build) => {
        build.priorityPlugins.push(prepend(logicPrepend));
        build.priorityPlugins.push(prepend(stylePrepend));
      });
    }),
  ];
}

module.exports = runtimePlugin;
