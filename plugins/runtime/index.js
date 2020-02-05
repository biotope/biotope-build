const cssExtras = require('./postcss-plugin-css-extras');
const { getRuntime, getRuntimeJavascript, getRuntimeSass } = require('./runtime');
const { getPrependConfig, prepend } = require('./prepend');

const runtimePlugin = () => ({
  name: 'biotope-build-plugin-runtime',
  hook: 'before-build',
  priority: 10,
  runner(projectConfig, builds) {
    const { extLogic, extStyle } = projectConfig;
    const variables = getRuntime(projectConfig);
    const logicPrepend = getPrependConfig(getRuntimeJavascript(variables), extLogic);
    const stylePrepend = getPrependConfig(getRuntimeSass(variables), extStyle);

    builds.forEach(({ build }) => {
      build.pluginsConfig.postcss[0].plugins.unshift(cssExtras(variables));
      build.priorityPlugins.unshift(prepend(logicPrepend));
      build.priorityPlugins.unshift(prepend(stylePrepend));
    });
  },
});

module.exports = runtimePlugin;
