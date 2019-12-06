/**
 * TODO: MOVE PLUGIN TO OWN REPO
 */

const { readFileSync, createFileSync, writeFileSync } = require('fs-extra');
const { sync: glob } = require('glob');
const { resolve, dirname, basename } = require('path');
const handlebars = require('handlebars');
const { watch } = require('chokidar');
const setValue = require('set-value');
const { saveConfigPlugin, runOnceAfterBuildStartPlugin } = require('../helpers');
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

const gatherData = (projectFolder, globString) => {
  const collectedData = {};
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

const compileHandlebars = (projectFolder, file, data, hbs, folder) => {
  const targetPath = `${folder}/${cleanFilePath(projectFolder, file, '.hbs')}.html`;
  const hydrated = hbs.compile(readFileSync(file, { encoding: 'utf8' }))({ data });

  createFileSync(targetPath);
  writeFileSync(targetPath, hydrated);
};

function handlebarsPlugin(pluginOptions = {}) {
  const dataPatterns = createGlobPattern(pluginOptions.data || []);
  const partialPatterns = createGlobPattern(pluginOptions.partial || []);
  const sourcePatterns = createGlobPattern(pluginOptions.source || []);
  const config = {};

  return [
    saveConfigPlugin(config),
    runOnceAfterBuildStartPlugin(() => {
      const templateData = gatherData(config.project, dataPatterns);

      registerHelpers(handlebars);
      registerPartials(config.project, partialPatterns, handlebars);

      if (!config.serve) {
        glob(sourcePatterns, (_, files) => files.forEach((file) => {
          compileHandlebars(config.project, file, templateData, handlebars, config.output);
        }));
      } else {
        watch(sourcePatterns).on('all', (_, file) => {
          compileHandlebars(config.project, file, templateData, handlebars, config.output);
        });
      }
    }),
  ];
}

module.exports = handlebarsPlugin;
