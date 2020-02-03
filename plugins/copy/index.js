const { resolve, dirname } = require('path');
const { readFileSync, statSync, existsSync } = require('fs-extra');
const { sync: glob } = require('glob');
const { resolver } = require('../../lib/api/common/resolver');
const watchFilesPlugin = require('../watch-files');

const getConfig = (config, projectConfig, builds) => (
  typeof config === 'function' ? config(projectConfig, builds) : config
).map((input) => ({
  from: input.from || `${projectConfig.project}/${input}`,
  to: input.to || input.from || input,
  ignore: input.ignore || [],
})).map(({ from, to, ignore }) => { // /**/*
  const fromResolved = resolve(from);
  const newTo = from.indexOf('*') < 0 && existsSync(fromResolved) && !statSync(fromResolved).isDirectory()
    ? dirname(to)
    : to;
  return {
    from,
    to: newTo === '.' ? '' : newTo,
    ignore,
  };
}).filter(({ from }) => glob(from).length > 0);

const toDirname = (path) => resolve(statSync(resolve(path)).isDirectory() ? path : dirname(path));

const copyPlugin = (pluginConfig = []) => ([
  {
    name: 'biotope-build-plugin-copy',
    hook: 'before-emit',
    priority: 5,
    runner(projectConfig, builds) {
      const [{ addFile }] = builds;

      const list = getConfig(pluginConfig, projectConfig, builds)
        .map(({ from, to, ignore }) => {
          const flatten = from.indexOf('*') >= 0;
          return resolver(from, true)
            .filter((file) => !ignore.some((ign) => (new RegExp(ign)).test(file)))
            .reduce((accumulator, file) => ({
              ...accumulator,
              [file]: !flatten
                ? `${to}${to ? '/' : ''}${file.replace(`${toDirname(from)}/`, '')}`
                : `${to}${to ? '/' : ''}${file.split('/').pop()}`,
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
