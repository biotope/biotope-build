const path = require('path');
const favicons = require('favicons');
const { joinPath, appendToHtml } = require('../helpers');

const devIcons = {
  favicons: true,
  android: false,
  appleIcon: false,
  appleStartup: false,
  coast: false,
  firefox: false,
  windows: false,
  yandex: false,
};

const prodIcons = {
  favicons: true,
  android: true,
  appleIcon: true,
  appleStartup: true,
  coast: true,
  firefox: true,
  windows: true,
  yandex: false,
};

const createIcons = (source, options) => new Promise((resolve) => {
  favicons(source, options, (error, response) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      resolve(null);
      return;
    }
    if (!response || !Array.isArray(response.images)) {
      // eslint-disable-next-line no-console
      console.log('No favicons created.');
      resolve(null);
      return;
    }
    resolve({ ...response });
  });
});

const faviconsPlugin = (pluginConfig = {}) => {
  if (!pluginConfig.source) {
    // eslint-disable-next-line no-console
    console.error('No "source" set on favicons plugin. Skipping…');
    return [];
  }
  let destination = '';
  let options = {};
  let contentPromise;

  return [
    {
      name: 'biotope-build-plugin-favicons',
      hook: 'before-build',
      async runner({ production }) {
        destination = pluginConfig.destination
          ? path.resolve(pluginConfig.destination).replace(`${process.cwd()}/`, '')
          : '';
        options = {
          ...favicons.config.defaults,
          icons: production ? prodIcons : devIcons,
          ...(pluginConfig.options || {}),
        };

        contentPromise = createIcons(pluginConfig.source, options);
      },
    },
    {
      name: 'biotope-build-plugin-favicons',
      hook: 'before-emit',
      async runner(_, [{ outputFiles, addFile }]) {
        if (!contentPromise) {
          return new Promise((resolve) => resolve());
        }
        let faviconContent;
        contentPromise.then((data) => {
          faviconContent = data;
        });

        return new Promise((resolve) => {
          const tryFinish = () => {
            if (faviconContent === undefined) {
              setTimeout(tryFinish, 0);
              return;
            }

            const { images, files, html } = faviconContent;
            const htmlNodes = html.filter((node) => node.indexOf('rel="manifest"') < 0);

            [...images, ...files.filter(({ name }) => name === 'browserconfig.xml')]
              .forEach(({ name, contents }) => addFile({
                name: joinPath(destination, name),
                content: contents,
              }));

            appendToHtml({ outputFiles, addFile }, 'favicons', htmlNodes, options.path, destination);
            resolve();
          };
          tryFinish();
        });
      },
    },
  ];
};

module.exports = faviconsPlugin;
