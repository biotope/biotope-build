const {
  resolve, basename, extname, sep,
} = require('path');
const postcss = require('postcss');
const postcssNodeSass = require('postcss-node-sass');
const postcssScss = require('postcss-scss');
const { readFileSync } = require('fs');
const { resolver } = require('../../lib/api/common/resolver');
const { postcss: getPostcssConfig } = require('../../lib/api/common/rollup/plugins/config/postcss');

const legacyCompileStylePlugin = (options = []) => {
  let files = [];
  let plugins = [];
  return [
    {
      name: 'biotope-build-plugin-legacy-compile-style',
      hook: 'before-build',
      priority: 0,
      runner(projectConfig) {
        plugins = [
          ...getPostcssConfig(projectConfig).plugins,
        ].reverse().slice(1).reverse();

        const projectPath = `${resolve(projectConfig.project)}${sep}`;
        files = resolver(options)
          .filter((file) => basename(file)[0] !== '_')
          .reduce((acc, input) => ([
            ...acc,
            { input, output: `${input.substr(projectPath.length, input.length - projectPath.length - extname(input).length)}.css` },
          ]), []);
      },
    },
    {
      name: 'biotope-build-plugin-legacy-compile-style',
      hook: 'before-emit',
      priority: 0,
      async runner(_, [{ addFile }]) {
        const postcssRunner = postcss(postcssNodeSass, ...plugins);
        await Promise.all(files.map(async ({ input, output }) => {
          const content = readFileSync(input);
          const result = await postcssRunner.process(content, {
            from: input,
            parser: postcssScss.parse,
          });
          addFile({ name: output, content: result.css });
        }));
      },
    },
  ];
};

module.exports = legacyCompileStylePlugin;
