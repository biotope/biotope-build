const { dirname, sep } = require('path');

const fixWindowsRegexResults = (match) => (
  sep === '\\' ? dirname(match.replace(/\\/g, '/')).substr(1) : match
);

const componentsJsonPlugin = (pattern) => ({
  name: 'biotope-build-plugin-component-json',
  hook: 'before-emit',
  priority: -10,
  runner(_, builds) {
    if (typeof pattern !== 'string' || !pattern) {
      return;
    }
    const regex = new RegExp(pattern.replace(/\//g, sep));

    const [{ addFile, legacy: noModulesBuild }] = builds;
    
    const outputs = builds.filter(build => noModulesBuild || !build.legacy).reduce((accumulator, { outputFiles }) => ([
      ...accumulator,
      ...Object.keys(outputFiles),
    ]), []);
    
    const content = JSON.stringify(
      outputs
        .filter((output) => regex.test(output))
        .map(fixWindowsRegexResults),
    );

    addFile({ name: 'components.json', content });
  },
});

module.exports = componentsJsonPlugin;
