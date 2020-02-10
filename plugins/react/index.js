const { resolve } = require('path');
const jsxTransform = require('jsx-transform');
const MagicString = require('magic-string');

const rollupJsxPlugin = ({ extensions, factory }) => ({
  name: 'biotope-build-jsx',
  transform(code, id) {
    if (
      (id.indexOf(resolve(`${process.cwd()}/node_modules`)) === 0)
      || (extensions ? !(new RegExp(`(${extensions.join('|')})$`)).test(id) : true)
    ) {
      return undefined;
    }

    const magicString = new MagicString(code);
    magicString.overwrite(0, code.length, jsxTransform.fromString(code, { factory }));

    return {
      code: magicString.toString(),
      map: magicString.generateMap(),
    };
  },
});

const reactPlugin = (pluginConfig = {}) => {
  const extIgnore = pluginConfig.extIgnore || ['.ts', '.tsx', '.vue'];
  const factory = /* pluginConfig.factory || */ 'React.createElement';
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const reactNamedExports = Object.keys(require(`${process.cwd()}/node_modules/react`))
    .filter((name) => name !== '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED');

  return {
    name: 'biotope-build-plugin-react',
    hook: 'before-build',
    priority: 10,
    runner({ extLogic }, builds) {
      const extensions = extLogic
        .filter((extension) => !extIgnore.some((ext) => extension === ext));

      builds.forEach(({ build }) => {
        build.priorityPlugins.push(rollupJsxPlugin({ extensions, factory }));

        if (build.pluginsConfig.babel) {
          // eslint-disable-next-line import/no-dynamic-require,global-require
          build.pluginsConfig.babel[0].presets.push(require(`${process.cwd()}/node_modules/@babel/preset-react`));
        }
        if (build.pluginsConfig.commonjs) {
          // eslint-disable-next-line no-param-reassign
          build.pluginsConfig.commonjs[0].namedExports.react = reactNamedExports;
        }
      });
    },
  };
};

module.exports = reactPlugin;
