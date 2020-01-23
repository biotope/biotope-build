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

    const componentsJsonContent = JSON.stringify(
      Object.keys(inputs).filter((key) => (new RegExp(pattern)).test(inputs[key])),
    );

    // eslint-disable-next-line no-param-reassign
    builds[0].outputFiles['components.json'] = componentsJsonContent;
  },
});

module.exports = componentsJsonPlugin;
