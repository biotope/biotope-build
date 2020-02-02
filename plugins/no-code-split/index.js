const { requireJson } = require('../../lib/api/common/json-handlers');

const { name: packageName } = requireJson(`${process.cwd()}/package.json`);

const safeName = (name) => name.replace(/[&/\\#,+()$~%.'":*?<>{}\s-]/g, '_').toLowerCase();

const noCodeSplitPlugin = (pluginConfig = {}) => ({
  name: 'biotope-build-plugin-no-code-split',
  hook: 'before-build',
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
              banner: '',
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