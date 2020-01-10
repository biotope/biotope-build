const { resolve } = require('path');
const cpy = require('cpy');
const { sync: glob } = require('glob');
const chokidar = require('chokidar');
const { resolver } = require('../../lib/api/common/resolver');
const { saveConfig, beforeBuildStart } = require('../helpers');

const popLast = (file, gutter = '/') => file.split(gutter)
  .reverse().slice(1).reverse()
  .join(gutter);

function copyPlugin(pluginConfig) {
  const projectConfig = {};
  return [
    saveConfig(projectConfig),
    beforeBuildStart(() => {
      const list = (typeof pluginConfig === 'function' ? pluginConfig() : pluginConfig)
        .filter(({ from }) => glob(from).length > 0);

      return Promise.all(list.map(async ({ from, to, ignore }) => {
        const flatten = from.indexOf('*') >= 0;

        const files = resolver([from], true)
          .filter((file) => !ignore.some((ign) => (new RegExp(ign)).test(file)))
          .reduce((accumulator, file) => ({
            ...accumulator,
            [file]: !flatten
              ? popLast(`${to}/${file.replace(`${resolve(from)}/`, '')}`)
              : popLast(`${to}/${file.split('/').pop()}`),
          }), {});

        for (let index = 0; index < Object.keys(files).length; index += 1) {
          const input = Object.keys(files)[index];

          if (projectConfig.watch) {
            chokidar.watch(input).on('all', async () => cpy(input, files[input]));
          } else {
            // eslint-disable-next-line no-await-in-loop
            await cpy(input, files[input]);
          }
        }
      }));
    }),
  ];
}

module.exports = copyPlugin;
