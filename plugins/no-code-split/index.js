/**
 * TODO: MOVE PLUGIN TO OWN REPO
 */

const { isLegacyBuild, beforeBuildStart } = require('../helpers');

// eslint-disable-next-line import/no-dynamic-require,@typescript-eslint/no-var-requires
const packageJson = require(`${process.cwd()}/package.json`);

const safeName = (name) => name.replace(/[&/\\#,+()$~%.'":*?<>{}\s-]/g, '_').toLowerCase();

function noCodeSplitPlugin(pluginConfig = {}) {
  const files = pluginConfig.files || 'legacy';
  return [
    beforeBuildStart(({ legacy }, builds) => {
      const newBuilds = [];
      builds.forEach((build, index) => {
        if (files === 'all' || (files === 'legacy' && isLegacyBuild(legacy, build))) {
          newBuilds.push(...Object.keys(build.input).map((key) => ({
            ...build,
            input: {
              [key]: build.input[key],
            },
            output: {
              ...build.output,
              format: 'iife',
              name: `${safeName(packageJson.name)}__${safeName(key)}`,
              banner: '',
            },
            manualChunks: undefined,
          })));

          // eslint-disable-next-line no-param-reassign
          delete builds[index];
        }
      });
      newBuilds.forEach((newBuild) => builds.push(newBuild));
    }),
  ];
}

module.exports = noCodeSplitPlugin;
