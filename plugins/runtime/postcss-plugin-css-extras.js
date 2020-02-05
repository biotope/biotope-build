const { plugin: postcssPlugin } = require('postcss');
const { getVariablesCss } = require('./runtime');

const cssExtrasPlugin = postcssPlugin('biotope-build-postcss-plugin-css-extras', (variables) => {
  const cssVariables = getVariablesCss(variables);
  return (root) => {
    if (root.source.input.file.slice(-4) !== '.css') {
      return;
    }

    root.walkDecls((node) => {
      const value = node.value.toString();
      if (value[0] === '$') {
        // eslint-disable-next-line no-param-reassign
        node.value = cssVariables[value.slice(1)];
      }
    });
  };
});

module.exports = cssExtrasPlugin;
