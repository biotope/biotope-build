const path = require('path');
const favicons = require('favicons');
const { addOutputFile } = require('../../lib/api/common/emit');

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
  yandex: true,
};

const joinPath = (left, right) => `${left}${left && left[left.length - 1] !== '/' ? '/' : ''}${right}`;

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

const replaceIconsHtmlPrefix = (iconsHtml, basePath, newPath, attributes = ['href', 'src']) => attributes
  .reduce((html, attribute) => html.map((node) => node.replace(
    `${attribute}="${basePath}`,
    `${attribute}="${joinPath(newPath, '')}`,
  )), iconsHtml);

const imagesPlugin = (pluginConfig = {}) => {
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
          // fixme include destination here somehow (for the html files)
          ...(pluginConfig.options || {}),
        };

        contentPromise = createIcons(pluginConfig.source, options);
      },
    },
    {
      name: 'biotope-build-plugin-favicons',
      hook: 'before-emit',
      async runner(_, builds) {
        if (!contentPromise || !builds.length) {
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

            faviconContent.images.forEach(({ name, contents }) => addOutputFile(
              joinPath(destination, name),
              contents,
              builds[0].outputFiles,
            ));

            builds.forEach(({ outputFiles }) => {
              Object.keys(outputFiles)
                .filter((file) => file.indexOf('.html') === (file.length - '.html'.length))
                .forEach((file) => {
                  const backPrefix = Array(file.split('/').length - 1).fill('..').join('/');
                  const links = replaceIconsHtmlPrefix(
                    faviconContent.html,
                    options.path,
                    joinPath(backPrefix, destination),
                  ).join('');
                  const html = typeof outputFiles[file].content === 'string'
                    ? outputFiles[file].content
                    : outputFiles[file].content.toString();

                  addOutputFile(file, html.replace('</head>', `${links}\n</head>`), outputFiles);
                });
            });

            resolve();
          };
          tryFinish();
        });
      },
    },
  ];
};

module.exports = imagesPlugin;
