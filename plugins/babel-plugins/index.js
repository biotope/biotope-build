
const babelPluginsPlugin = (pluginConfig = []) => ({
  name: 'biotope-build-plugin-babel-plugins',
  hook: 'before-build',
  priority: -5,
  runner(projectConfig, builds) {
    const babelPlugins = typeof pluginConfig === 'function' ? pluginConfig(projectConfig, builds) : pluginConfig;

    builds.forEach(({ build }) => {
      // eslint-disable-next-line no-param-reassign
      build.pluginsConfig.babel[0].plugins = babelPlugins;
    });
  },
});

module.exports = babelPluginsPlugin;
