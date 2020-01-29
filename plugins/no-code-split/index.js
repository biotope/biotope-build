const { requireJson } = require('../../lib/api/common/json-handlers');
const { isLegacyBuild } = require('../helpers');

const { name: packageName } = requireJson(`${process.cwd()}/package.json`);

const safeName = (name) => name.replace(/[&/\\#,+()$~%.'":*?<>{}\s-]/g, '_').toLowerCase();

const noCodeSplitPlugin = (pluginConfig = {}) => ({
  name: 'biotope-build-plugin-no-code-split',
  hook: 'before-build',
  runner({ legacy }, builds) {
    const files = pluginConfig.files || 'legacy';
    const newBuilds = [];

    builds.forEach(({ build, outputFiles, warnings }, index) => {
      if (files === 'all' || (files === 'legacy' && isLegacyBuild(legacy, build))) {
        newBuilds.push(...Object.keys(build.input).map((key) => ({
          build: {
            ...build,
            input: {
              [key]: build.input[key],
            },
            output: {
              ...build.output,
              format: 'iife',
              name: `${safeName(packageName)}__${safeName(key)}`,
              banner: '',
            },
            manualChunks: undefined,
          },
          outputFiles,
          warnings,
        })));

        builds.splice(index, 1);
      }
    });
    newBuilds.forEach((newBuild) => builds.push(newBuild));
  },
});

module.exports = noCodeSplitPlugin;
