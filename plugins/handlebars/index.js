const { resolve, dirname, basename } = require('path');
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
    .split('/')
    .filter((slug) => !!slug)
    .join('/');

  return ext ? `${dirname(name)}/${basename(name, ext)}` : name;
};

const gatherData = (runtime, projectFolder, globString) => {
  const collectedData = deepmerge({}, runtime);
  glob(globString).forEach((file) => setValue(
    collectedData,
    file.replace(`${projectFolder}/`, '').replace('.json', '').replace(new RegExp('/', 'g'), '.'),
    parseJson(readFileSync(file, { encoding: 'utf8' })),
  ));
  return collectedData;
};

const registerPartials = (projectFolder, partialPattern, hbs) => glob(partialPattern)
  .forEach((file) => hbs.registerPartial(
    cleanFilePath(projectFolder, file, '.hbs'),
    readFileSync(file, { encoding: 'utf8' }),
  ));

const handlebarsPlugin = (pluginOptions = {}) => [
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
      const dataPatterns = createGlobPattern(pluginOptions.data || []);
      const partialPatterns = createGlobPattern(pluginOptions.partial || []);
      const sourcePatterns = createGlobPattern(pluginOptions.source || []);
      const templateData = gatherData(runtime, project, dataPatterns);

      registerPartials(project, partialPatterns, handlebars);

      glob(sourcePatterns).forEach((file) => addFile({
        name: `${cleanFilePath(project, file, '.hbs').replace('./', '')}.html`,
        content: handlebars.compile(readFileSync(file, { encoding: 'utf8' }))({ data: templateData }),
      }));
    },
  },
  watchFilesPlugin([
    ...pluginOptions.data,
    ...pluginOptions.partial,
    ...pluginOptions.source,
  ]),
];

module.exports = handlebarsPlugin;
