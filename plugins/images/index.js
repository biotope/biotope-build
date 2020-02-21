const image = require('@rollup/plugin-image');
const svg = require('rollup-plugin-svg');
const postcssUrl = require('postcss-url');

const imagesPlugin = () => ({
  name: 'biotope-build-plugin-images',
  hook: 'before-build',
  priority: -5,
  runner(_, builds) {
    builds.forEach(({ build }) => {
      build.plugins.push(svg());
      build.plugins.push(image({ exclude: /.svg$/ }));
      build.pluginsConfig.postcss[0].plugins.unshift(postcssUrl({ url: 'inline' }));
    });
  },
});

module.exports = imagesPlugin;
