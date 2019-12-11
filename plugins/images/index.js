const images = require('rollup-plugin-image-base64');
const svg = require('rollup-plugin-svg');
const { beforeBuildStart } = require('../helpers');

function imagesPlugin() {
  return beforeBuildStart((_, builds) => {
    builds.forEach((build) => {
      build.plugins.push(svg());
      build.plugins.push(images());
    });
  });
}

module.exports = imagesPlugin;
