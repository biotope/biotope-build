const { resolve } = require('path');
const { readFileSync } = require('fs-extra');
const { sync: glob } = require('glob');
const { resolver } = require('../../lib/api/common/resolver');
const { addOutputFile } = require('../../lib/api/common/emit');

const copyPlugin = (pluginConfig) => ({
  name: 'biotope-build-plugin-copy',
  hook: 'before-emit',
  priority: 5,
  runner(projectConfig, builds) {
    if (!builds.length) {
      return;
    }

    const list = (typeof pluginConfig === 'function' ? pluginConfig(projectConfig, builds) : pluginConfig)
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

    Object.keys(list)
      .forEach((input) => addOutputFile(list[input], readFileSync(input), builds[0].outputFiles));
  },
});

module.exports = copyPlugin;
