const image = require('@rollup/plugin-image');
const svg = require('rollup-plugin-svg');

const imagesPlugin = () => ({
  name: 'biotope-build-plugin-images',
  hook: 'before-build',
  priority: 10,
  runner(_, builds) {
    builds.forEach(({ build }) => {
      build.plugins.push(svg());
      build.plugins.push(image({
        exclude: /.svg$/,
      }));
    });
  },
});

module.exports = imagesPlugin;
