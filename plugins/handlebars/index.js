const { readFileSync } = require('fs-extra');
const { sync: glob } = require('glob');
const { resolve, dirname, basename } = require('path');
const handlebars = require('handlebars');
const setValue = require('set-value');
const deepmerge = require('deepmerge');
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
    JSON.parse(readFileSync(file, { encoding: 'utf8' })),
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
    runner({ project, runtime }, builds) {
      if (!builds.length) {
        return;
      }
      const dataPatterns = createGlobPattern(pluginOptions.data || []);
      const partialPatterns = createGlobPattern(pluginOptions.partial || []);
      const sourcePatterns = createGlobPattern(pluginOptions.source || []);
      const templateData = gatherData(runtime, project, dataPatterns);

      registerPartials(project, partialPatterns, handlebars);

      glob(sourcePatterns).forEach((file) => {
        const outputFile = `${cleanFilePath(project, file, '.hbs').replace('./', '')}.html`;
        const contents = handlebars.compile(readFileSync(file, { encoding: 'utf8' }))({ data: templateData });
        // eslint-disable-next-line no-param-reassign
        builds[0].outputFiles[outputFile] = contents;
      });
    },
  },
];

module.exports = handlebarsPlugin;
