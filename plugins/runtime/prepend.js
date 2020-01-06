const { resolve } = require('path');
const MagicString = require('magic-string');

const getPrependConfig = (runtime, extensions) => ({
  string: runtime,
  extensions,
  nodeModules: true,
});

const prepend = ({ string, extensions, nodeModules }) => ({
  name: 'biotope-build-prepend',
  transform(code, id) {
    if (
      !string
      || (!nodeModules && id.indexOf(resolve(`${process.cwd()}/node_modules`)) === 0)
      || (extensions ? !(new RegExp(`(${extensions.join('|')})$`)).test(id) : true)
    ) {
      return undefined;
    }

    const magicString = new MagicString(code);
    magicString.prepend(`${string}\n`);

    return {
      code: magicString.toString(),
      map: magicString.generateMap(),
    };
  },
});

module.exports = {
  getPrependConfig,
  prepend,
};
