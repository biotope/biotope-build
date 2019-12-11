const { outputFileSync } = require('fs-extra');
const { isLegacyBuild, beforeBuildStart } = require('../helpers');

function componentsJsonPlugin(pattern) {
  return beforeBuildStart(({ output, legacy }, builds) => {
    const inputs = builds.reduce((accumulator, build) => ({
      ...accumulator,
      ...(!isLegacyBuild(legacy, build) ? build.input : {}),
    }), {});

    const components = Object.keys(inputs).filter((key) => (new RegExp(pattern)).test(inputs[key]));

    outputFileSync(`${output}/components.json`, JSON.stringify(components));
  });
}

module.exports = componentsJsonPlugin;
