// const { isLegacyBuild } = require('../helpers');

// eslint-disable-next-line import/no-dynamic-require,@typescript-eslint/no-var-requires
// const packageJson = require(`${process.cwd()}/package.json`);

// const safeName = (name) => name.replace(/[&/\\#,+()$~%.'":*?<>{}\s-]/g, '_').toLowerCase();

const noCodeSplitPlugin = (/* pluginConfig = {} */) => ({
  name: 'biotope-build-plugin-no-code-split',
  hook: 'before-build',
  runner(/* { legacy }, builds */) {
    throw new Error('Not implemented yet…');

    // TODO: biotope-build needs to be reviewed in terms of how it creates the legacy versions of
    // the files. This is because this plugin needs to change the "builds" variable drastically in
    // order to work.
    // Possible solution: remove this as a plugin and incorporate it as an option of biotope-build

    // const files = pluginConfig.files || 'legacy';
    // const newBuilds = [];

    // builds.forEach(({ build, outputFiles, warnings }, index) => {
    //   if (files === 'all' || (files === 'legacy' && isLegacyBuild(legacy, build))) {
    //     newBuilds.push(...Object.keys(build.input).map((key) => ({
    //       build: {
    //         ...build,
    //         input: {
    //           [key]: build.input[key],
    //         },
    //         output: {
    //           ...build.output,
    //           format: 'iife',
    //           name: `${safeName(packageJson.name)}__${safeName(key)}`,
    //           banner: '',
    //         },
    //         manualChunks: undefined,
    //       },
    //       outputFiles,
    //       warnings,
    //     })));

    //     builds.splice(index, 1);
    //   }
    // });
    // newBuilds.forEach((newBuild) => builds.push(newBuild));
  },
});

module.exports = noCodeSplitPlugin;
