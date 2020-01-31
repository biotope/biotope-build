
const componentsJsonPlugin = (pattern) => ({
  name: 'biotope-build-plugin-component-json',
  hook: 'before-emit',
  priority: -10,
  runner(_, builds) {
    const [{ addFile }] = builds;
    const inputs = builds.reduce((accumulator, { build, legacy }) => ({
      ...accumulator,
      ...(!legacy ? build.input : {}),
    }), {});

    const content = JSON.stringify(
      Object.keys(inputs).filter((key) => (new RegExp(pattern)).test(inputs[key])),
    );

    addFile({ name: 'components.json', content });
  },
});

module.exports = componentsJsonPlugin;
