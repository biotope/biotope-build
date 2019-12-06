const { outputFileSync } = require('fs-extra');

function componentsJsonPlugin() {
  return ['before-build', ({ output, extLogic, legacy }, builds) => {
    const inputs = builds.reduce((accumulator, { input, output: { banner: isLegacy } }) => ({
      ...accumulator,
      ...(!isLegacy ? input : {}),
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
  }];
}

module.exports = componentsJsonPlugin;
