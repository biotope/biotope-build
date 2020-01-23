const { resolve } = require('path');
const { readFileSync } = require('fs-extra');
const { addOutputFile } = require('../../lib/api/common/emit');
const copyPlugin = require('../copy');

const toArray = (files) => {
  if (!files) {
    return [];
  }
  return Array.isArray(files) ? files : [files];
};

const hydrateTemplate = (output, { template, prepend, append }) => (template
  ? readFileSync(resolve(template))
  // eslint-disable-next-line global-require
  : require('./default-template')({
    output,
    prepend: toArray(prepend),
    append: toArray(append),
  }));

const devPreviewPlugin = (pluginConfig = {}) => {
  const output = pluginConfig.output || 'dev-preview';
  const assets = pluginConfig.assets || 'dev-preview';
  return [
    copyPlugin(({ project }) => ([
      {
        from: `${__dirname}/files`,
        to: output,
        ignore: [],
      },
      {
        from: `${project}/${assets}`,
        to: output,
        ignore: [],
      },
    ])),
    {
      name: 'biotope-build-plugin-dev-preview',
      hook: 'before-emit',
      priority: 5,
      runner(_, builds) {
        if (!builds.length) {
          return;
        }
        addOutputFile('index.html', hydrateTemplate(output, pluginConfig), builds[0].outputFiles);
      },
    },
  ];
};

module.exports = devPreviewPlugin;
