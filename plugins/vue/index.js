const { resolve } = require('path');
const VuePlugin = require('rollup-plugin-vue');
const { alias } = require('../../lib/api/common/rollup/plugins/config');

const getVueDist = (isProduction, needsTemplateCompiler) => {
  if (!isProduction) {
    return resolve(`./node_modules/vue/dist/${!needsTemplateCompiler ? 'vue.runtime.esm' : 'vue.esm'}`);
  }
  return resolve(`./node_modules/vue/dist/${!needsTemplateCompiler ? 'vue.runtime.min' : 'vue.min'}`);
};

const vuePlugin = (pluginConfig = {}) => ({
  name: 'biotope-build-plugin-vue',
  hook: 'before-build',
  runner(projectConfig, builds) {
    const newAliasConfig = alias({
      alias: {
        ...(projectConfig.alias || {}),
        vue: getVueDist(projectConfig.production, !pluginConfig.runtimeOnly),
      },
    });

    builds.forEach(({ build }) => {
      // eslint-disable-next-line no-param-reassign
      build.pluginsConfig.alias[0] = newAliasConfig;

      build.priorityPlugins.push(VuePlugin());
    });
  },
});

module.exports = vuePlugin;
