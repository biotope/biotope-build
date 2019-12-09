/**
 * TODO: MOVE PLUGIN TO OWN REPO
 */

const { writeFileSync } = require('fs-extra');
const copy = require('rollup-plugin-copy-glob');
const { saveConfig, beforeBuildStart, onBundleEnd } = require('../helpers');

const template = ({ output, prepend, append }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Development Preview</title>
  ${prepend.reduce((acc, script) => `${acc}<script src="${script}"></script>`, '')}
</head>

<body>
  <div id="app">
    <develop-preview></develop-preview>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js"></script>
  <script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
  <script src="https://unpkg.com/vue-async-computed"></script>

  <script>;__BIOTOPE_DEV_PREVIEW_ROOT="${output}";</script>
  <link rel="stylesheet" href="./${output}/dev-preview.css">
  <script src="./${output}/dev-preview.js"></script>
  ${append.reduce((acc, script) => `${acc}<script src="${script}"></script>`, '')}
</body>
</html>
`;

const toArray = (files) => {
  if (!files) {
    return [];
  }
  return Array.isArray(files) ? files : [files];
};

function devPreviewPlugin(pluginConfig = {}) {
  const output = pluginConfig.output || 'dev-preview';
  const assets = pluginConfig.assets || 'dev-preview';
  const prepend = toArray(pluginConfig.prepend);
  const append = toArray(pluginConfig.append);
  const projectConfig = {};
  let isFirstTime = true;
  return [
    saveConfig(projectConfig),
    beforeBuildStart((_, builds) => {
      builds.forEach((build) => {
        build.plugins.push(copy([
          {
            files: `${__dirname}/files/**/*`,
            dest: `${projectConfig.output}/${output}`,
          },
          {
            files: `${projectConfig.project}/${assets}/**/*`,
            dest: `${projectConfig.output}/${output}`,
          },
        ], { watch: !!projectConfig.serve }));
      });
    }),
    onBundleEnd(() => {
      if (isFirstTime) {
        isFirstTime = false;
        writeFileSync(`${projectConfig.output}/index.html`, template({
          output, prepend, append,
        }));
      }
    }),
  ];
}

module.exports = devPreviewPlugin;
