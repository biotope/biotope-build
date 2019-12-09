const { outputFileSync } = require('fs-extra');
const { beforeBuildStart } = require('../helpers');

const isLegacyBuild = (legacyOption, filesObject) => {
  if (!legacyOption) {
    return false;
  }
  return !!Object.keys(filesObject)
    .find((file) => file.indexOf(legacyOption.suffix) === file.length - legacyOption.suffix.length);
};

function componentsJsonPlugin() {
  return beforeBuildStart(({ output, extLogic, legacy }, builds) => {
    const inputs = builds.reduce((accumulator, { input }) => ({
      ...accumulator,
      ...(isLegacyBuild(legacy, input) ? input : {}),
    }), {});

    const components = Object.keys(inputs)
      .filter((outputFile) => outputFile.indexOf('components/') === 0)
      .filter((outputFile) => extLogic.some((ext) => inputs[outputFile].slice(
        inputs[outputFile].length - ext.length - 'index'.length,
      ) === `index${ext}`));

    const componentsFiltered = !legacy ? components : components.filter(
      (file) => file.indexOf(legacy.suffix) !== file.length - legacy.suffix.length,
    );

    outputFileSync(`${output}/components.json`, JSON.stringify(componentsFiltered));
  });
}

module.exports = componentsJsonPlugin;
