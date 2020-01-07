const image = require('@rollup/plugin-image');
const svg = require('rollup-plugin-svg');
const { beforeBuildStart } = require('../helpers');

function imagesPlugin() {
  return beforeBuildStart((_, builds) => {
    builds.forEach((build) => {
      build.plugins.push(svg());
      build.plugins.push(image({
        exclude: /.svg$/,
      }));
    });
  });
}

module.exports = imagesPlugin;
