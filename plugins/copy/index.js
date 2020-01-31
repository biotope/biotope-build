const { resolve } = require('path');
const { readFileSync } = require('fs-extra');
const { sync: glob } = require('glob');
const { resolver } = require('../../lib/api/common/resolver');
const watchFilesPlugin = require('../watch-files');

const getConfig = (config, ...args) => (typeof config === 'function' ? config(...args) : config);

const copyPlugin = (pluginConfig = []) => ([
  {
    name: 'biotope-build-plugin-copy',
    hook: 'before-emit',
    priority: 5,
    runner(projectConfig, builds) {
      const [{ addFile }] = builds;

      const list = getConfig(pluginConfig, projectConfig, builds)
        .map((input) => ({
          from: input.from || `${projectConfig.project}/${input}`,
          to: input.to || input.from || input,
          ignore: input.ignore || [],
        }))
        .filter(({ from }) => glob(from).length > 0)
        .map(({ from, to, ignore }) => {
          const flatten = from.indexOf('*') >= 0;
          return resolver([from], true)
            .filter((file) => !ignore.some((ign) => (new RegExp(ign)).test(file)))
            .reduce((accumulator, file) => ({
              ...accumulator,
              [file]: !flatten
                ? `${to}/${file.replace(`${resolve(from)}/`, '')}`
                : `${to}/${file.split('/').pop()}`,
            }), {});
        })
        .reduce((accumulator, files) => ({
          ...accumulator,
          ...files,
        }), {});

      Object.keys(list).forEach((input) => addFile({
        name: list[input],
        content: readFileSync(input),
      }));
    },
  },
  watchFilesPlugin(
    (projectConfig, builds) => getConfig(pluginConfig, projectConfig, builds)
      .map(({ from }) => from),
  ),
]);

module.exports = copyPlugin;
