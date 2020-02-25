const { requireJson, safeName } = require('../../lib/api/common/json-handlers');

const { name: packageName } = requireJson(`${process.cwd()}/package.json`);

const noCodeSplitPlugin = (pluginConfig = {}) => ({
  name: 'biotope-build-plugin-no-code-split',
  hook: 'before-build',
  priority: -10,
  runner(_, builds) {
    const files = pluginConfig.files || 'legacy';
    const newBuilds = [];

    builds.forEach(({
      build, legacy, outputFiles, warnings, addFile, removeFile,
    }, index) => {
      if (files === 'all' || (files === 'legacy' && legacy)) {
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
            },
            manualChunks: undefined,
          },
          outputFiles,
          warnings,
          addFile,
          removeFile,
        })));

        builds.splice(index, 1);
      }
    });
    newBuilds.forEach((newBuild) => builds.push(newBuild));
  },
});

module.exports = noCodeSplitPlugin;
