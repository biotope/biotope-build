const { resolve } = require('path');
const { readFileSync } = require('fs-extra');
const { defaultConfigs } = require('../../lib/api/common/defaults');
const copyPlugin = require('../copy');
const componentsJsonPlugin = require('../components-json');

const toArray = (files) => {
  if (!files) {
    return [];
  }
  return Array.isArray(files) ? files : [files];
};

const hydrateTemplate = (output, scaffolding, { template, prepend, append }) => (template
  ? readFileSync(resolve(template))
  // eslint-disable-next-line global-require
  : require('./default-template')({
    output,
    scaffolding,
    prepend: toArray(prepend),
    append: toArray(append),
  }));

const devPreviewPlugin = (pluginConfig = {}) => {
  const output = pluginConfig.output || 'dev-preview';
  const scaffolding = pluginConfig.scaffolding || '/scaffolding';
  const assets = pluginConfig.assets || 'dev-preview';
  return [
    copyPlugin([
      {
        from: assets,
        to: output,
      },
      {
        from: `${__dirname}/files`,
        to: output,
        ignore: [],
      },
    ]),
    {
      name: 'biotope-build-plugin-dev-preview',
      hook: 'before-build',
      priority: 5,
      runner(projectConfig) {
        if (projectConfig.componentsJson) {
          return;
        }

        // eslint-disable-next-line no-param-reassign
        projectConfig.componentsJson = defaultConfigs.componentsJson;
        projectConfig.plugins.push(componentsJsonPlugin(defaultConfigs.componentsJson));
      },
    },
    {
      name: 'biotope-build-plugin-dev-preview',
      hook: 'before-emit',
      priority: 5,
      runner(_, [{ addFile }]) {
        addFile({ name: 'index.html', content: hydrateTemplate(output, scaffolding, pluginConfig) });
      },
    },
  ];
};

module.exports = devPreviewPlugin;
