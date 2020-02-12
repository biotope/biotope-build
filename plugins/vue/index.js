const { resolve } = require('path');
const VuePlugin = require('rollup-plugin-vue');
const { alias, babel } = require('../../lib/api/common/rollup/plugins/config');
const { invertObject, manualChunks } = require('../../lib/api/common/rollup/manual-chunks');

const additionalVuePackages = ['vue-property-decorator', 'vue-class-component', 'vue-runtime-helpers'];

const getVueDist = (isProduction, needsTemplateCompiler) => {
  if (!isProduction) {
    return resolve(`./node_modules/vue/dist/${!needsTemplateCompiler ? 'vue.runtime.esm' : 'vue.esm'}`);
  }
  return resolve(`./node_modules/vue/dist/${!needsTemplateCompiler ? 'vue.runtime.min' : 'vue.min'}`);
};

const vuePlugin = (pluginConfig = {}) => ({
  name: 'biotope-build-plugin-vue',
  hook: 'before-build',
  priority: 5,
  runner(projectConfig, builds) {
    // eslint-disable-next-line no-param-reassign
    projectConfig.alias = {
      ...(projectConfig.alias || {}),
      vue: getVueDist(projectConfig.production, !pluginConfig.runtimeOnly),
    };

    const invertedChunks = invertObject(projectConfig.chunks || {});
    const hasVueChunk = invertedChunks.vue !== undefined;

    if (hasVueChunk) {
      projectConfig.chunks[invertedChunks.vue].push(...additionalVuePackages);
    }

    builds.forEach(({ build, legacy }) => {
      // eslint-disable-next-line no-param-reassign
      build.pluginsConfig.alias[0] = alias(projectConfig);

      if (build.pluginsConfig.babel) {
        // eslint-disable-next-line no-param-reassign
        build.pluginsConfig.babel[0] = babel(projectConfig);
      }

      if (hasVueChunk) {
        // eslint-disable-next-line no-param-reassign
        build.manualChunks = manualChunks('vendor', projectConfig.chunks || {}, legacy ? projectConfig.legacy : false);
      }

      build.priorityPlugins.push(VuePlugin());
    });
  },
});

module.exports = vuePlugin;
