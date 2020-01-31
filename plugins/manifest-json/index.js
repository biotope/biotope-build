const imageSize = require('image-size');
const { appendToHtml } = require('../helpers');

const extensions = ['.ico', '.png', '.svg', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp'];

const manifestJsonPlugin = (pluginConfig = {}) => ({
  name: 'biotope-build-plugin-manifest-json',
  hook: 'before-emit',
  priority: -10,
  async runner(_, [build]) {
    const { outputFiles, addFile } = build;
    const images = Object.keys(outputFiles)
      .filter((file) => extensions.some((ext) => (new RegExp(`${ext}$`)).test(file)))
      .map((image) => ({
        image,
        content: Buffer.from(outputFiles[image].content),
      }));

    addFile({
      name: 'manifest.json',
      content: JSON.stringify({
        ...pluginConfig,
        icons: await Promise.all(images.map(async ({ image, content }) => {
          const { width, height, type } = imageSize(content);
          return {
            src: image,
            type: `image/${type}`,
            sizes: `${width}x${height}`,
          };
        })),
      }, null, 2),
    });

    appendToHtml(build, 'manifest', ['<link rel="manifest" href="/manifest.json">'], '/', '');
  },
});

module.exports = manifestJsonPlugin;
