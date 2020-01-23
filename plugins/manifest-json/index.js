const imageSize = require('image-size');
const { addOutputFile } = require('../../lib/api/common/emit');

const extensions = ['.ico', '.png', '.svg', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp'];

const manifestJsonPlugin = (pluginConfig = {}) => ({
  name: 'biotope-build-plugin-manifest-json',
  hook: 'before-emit',
  priority: -10,
  async runner(_, builds) {
    if (!builds.length) {
      return;
    }

    const images = Object.keys(builds[0].outputFiles)
      .filter((file) => extensions.some((ext) => (new RegExp(`${ext}$`)).test(file)));

    addOutputFile('manifest.json', JSON.stringify({
      ...pluginConfig,
      icons: await Promise.all(images.map(async (image) => {
        const { width, height, type } = imageSize(builds[0].outputFiles[image].content);
        return {
          src: image,
          type: `image/${type}`,
          sizes: `${width}x${height}`,
        };
      })),
    }, null, 2), builds[0].outputFiles);
  },
});

module.exports = manifestJsonPlugin;
