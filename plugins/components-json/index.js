const { outputFileSync } = require('fs-extra');
const { isLegacyBuild, beforeBuildStart } = require('../helpers');

function componentsJsonPlugin() {
  return beforeBuildStart(({ output, extLogic, legacy }, builds) => {
    const inputs = builds.reduce((accumulator, build) => ({
      ...accumulator,
      ...(!isLegacyBuild(legacy, build) ? build.input : {}),
    }), {});

    const components = Object.keys(inputs)
      .filter((outputFile) => outputFile.indexOf('components/') === 0)
      .filter((outputFile) => extLogic.some((ext) => inputs[outputFile].slice(
        inputs[outputFile].length - ext.length - 'index'.length,
      ) === `index${ext}`));

    outputFileSync(`${output}/components.json`, JSON.stringify(components));
  });
}

module.exports = componentsJsonPlugin;
