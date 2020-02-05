const { resolve, basename, sep } = require('path');
const { readFileSync, statSync, existsSync } = require('fs-extra');
const { resolver } = require('../../lib/api/common/resolver');
const watchFilesPlugin = require('../watch-files');

const hasWildCard = (input) => input.indexOf('*') >= 0;

const getProjectFolder = (folder) => `${resolve(`${process.cwd()}/${folder}`)}${sep}`;

const findInput = (from, folder) => {
  const fromSimple = resolve(from);
  const fromFolder = resolve(`${folder}/${from}`);
  if (existsSync(fromSimple)) {
    return fromSimple;
  } if (existsSync(fromFolder)) {
    return fromFolder;
  }
  return '';
};

const expandFrom = (from, folder) => {
  if (hasWildCard(from)) {
    return resolver(from, true);
  }

  const resolvedInput = findInput(from, folder);
  if (!resolvedInput) {
    return [];
  }

  if (!statSync(resolvedInput).isDirectory()) {
    return [resolvedInput];
  }
  return resolver(resolvedInput, true);
};

const toCopyFiles = (files, folder, flatten = false, to = '', ignore = []) => files
  .map((from) => ({
    from,
    to: `${to || ''}${to ? '/' : ''}${flatten
      ? basename(from)
      : from.replace(getProjectFolder(folder), '')}`,
  }))
  .filter((file) => !ignore.some((ign) => (new RegExp(ign)).test(file)));

const getFiles = (input, folder) => {
  if (typeof input === 'string') {
    return toCopyFiles(expandFrom(input, folder), folder);
  }

  if (!input.from) {
    return [];
  }

  const fromHasWildCard = hasWildCard(input.from);
  const resolvedFrom = findInput(input.from, folder);
  const existsFrom = existsSync(resolvedFrom);

  if ((!fromHasWildCard && !existsFrom) || (fromHasWildCard && !input.to)) {
    return [];
  }

  const projectFolder = getProjectFolder(folder);
  const flatten = resolvedFrom.indexOf(projectFolder) !== 0;

  return toCopyFiles(expandFrom(input.from, folder), folder, flatten, input.to, input.ignore);
};

const getConfig = (config, projectConfig, builds) => (
  typeof config === 'function' ? config(projectConfig, builds) : config
);

const parseFiles = (
  pluginConfig, projectConfig, builds,
) => getConfig(pluginConfig, projectConfig, builds)
  .map((option) => getFiles(option, projectConfig.project))
  .reduce((accumulator, files) => ([...accumulator, ...files]), []);

const copyPlugin = (pluginConfig = []) => ([
  {
    name: 'biotope-build-plugin-copy',
    hook: 'before-emit',
    priority: 5,
    runner(projectConfig, builds) {
      const [{ addFile }] = builds;

      parseFiles(pluginConfig, projectConfig, builds)
        .forEach(({ from, to }) => addFile({ name: to, content: readFileSync(from) }));
    },
  },
  watchFilesPlugin(
    (projectConfig, builds) => parseFiles(pluginConfig, projectConfig, builds)
      .map(({ from }) => from),
  ),
]);

module.exports = copyPlugin;
