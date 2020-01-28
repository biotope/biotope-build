const { getRuntime, getRuntimeJavascript, getRuntimeSass } = require('./runtime');
const { getPrependConfig, prepend } = require('./prepend');

const runtimePlugin = () => ({
  name: 'biotope-build-plugin-runtime',
  hook: 'before-build',
  priority: 10,
  runner(projectConfig, builds) {
    if (!builds.length) {
      return;
    }
    const variables = getRuntime(projectConfig);
    const logicPrepend = getPrependConfig(getRuntimeJavascript(variables), projectConfig.extLogic);
    const stylePrepend = getPrependConfig(getRuntimeSass(variables), projectConfig.extStyle);

    builds.forEach(({ build }) => {
      build.priorityPlugins.unshift(prepend(logicPrepend));
      build.priorityPlugins.unshift(prepend(stylePrepend));
    });
  },
});

module.exports = runtimePlugin;
