const {
  resolve, dirname, basename, sep,
} = require('path');
const { readFileSync } = require('fs-extra');
const { sync: glob } = require('glob');
const handlebars = require('handlebars');
const setValue = require('set-value');
const deepmerge = require('deepmerge');
const { parseJson } = require('../../lib/api/common/json-handlers');
const watchFilesPlugin = require('../watch-files');
const registerHelpers = require('./register-helpers');

const createGlobPattern = (array) => (array.length === 1 ? array[0] : `{${array.join(',')}}`);

const cleanFilePath = (projectFolder, file, ext) => {
  const name = resolve(file)
    .replace(resolve(`${process.cwd()}/${projectFolder}`), '')
    .split(sep)
    .filter((slug) => !!slug)
    .join(sep);

  return ext ? `${dirname(name)}${sep}${basename(name, ext)}` : name;
};

const gatherData = (runtime, projectFolder, globString) => {
  const collectedData = deepmerge({}, runtime);
  glob(globString).forEach((file) => setValue(
    collectedData,
    file.replace(`${projectFolder}/`, '').replace('.json', '').replace(/\//g, '.'),
    parseJson(readFileSync(file, { encoding: 'utf8' })),
  ));
  return collectedData;
};

const registerPartials = (projectFolder, partialPattern, hbs) => glob(partialPattern)
  .forEach((file) => hbs.registerPartial(
    cleanFilePath(projectFolder, file, '.hbs').replace(/\\/g, '/'),
    readFileSync(file, { encoding: 'utf8' }),
  ));

const toArray = (array) => (Array.isArray(array || []) ? (array || []) : [array]);

const handlebarsPlugin = (pluginOptions = {}) => {
  const data = toArray(pluginOptions.data);
  const partials = toArray(pluginOptions.partial);
  const sources = toArray(pluginOptions.source);
  return [
    {
      name: 'biotope-build-plugin-handlebars',
      hook: 'before-build',
      runner() {
        registerHelpers(handlebars);
      },
    },
    {
      name: 'biotope-build-plugin-handlebars',
      hook: 'before-emit',
      runner({ project, runtime }, [{ addFile }]) {
        const dataPatterns = createGlobPattern(data);
        const partialPatterns = createGlobPattern(partials);
        const sourcePatterns = createGlobPattern(sources);
        const templateData = gatherData(runtime, project, dataPatterns);

        registerPartials(project, partialPatterns, handlebars);

        glob(sourcePatterns).forEach((file) => addFile({
          name: `${cleanFilePath(project, file, '.hbs').replace(`.${sep}`, '')}.html`,
          content: handlebars.compile(readFileSync(resolve(file), { encoding: 'utf8' }))(templateData),
        }));
      },
    },
    watchFilesPlugin([...data, ...partials, ...sources]),
  ];
};

module.exports = handlebarsPlugin;
