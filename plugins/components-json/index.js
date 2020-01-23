const { addOutputFile } = require('../../lib/api/common/emit');
const { isLegacyBuild } = require('../helpers');

const componentsJsonPlugin = (pattern) => ({
  name: 'biotope-build-plugin-component-json',
  hook: 'before-emit',
  priority: -10,
  runner({ legacy }, builds) {
    if (!builds.length) {
      return;
    }

    const inputs = builds.reduce((accumulator, { build }) => ({
      ...accumulator,
      ...(!isLegacyBuild(legacy, build) ? build.input : {}),
    }), {});

    const content = JSON.stringify(
      Object.keys(inputs).filter((key) => (new RegExp(pattern)).test(inputs[key])),
    );

    addOutputFile('components.json', content, builds[0].outputFiles);
  },
});

module.exports = componentsJsonPlugin;
