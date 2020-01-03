/**
 * TODO: MOVE PLUGIN TO OWN REPO
 */

const { outputFileSync, readFileSync } = require('fs-extra');
const { saveConfig, onBundleEnd } = require('../helpers');
const copyPlugin = require('../copy');

const template = ({ output, prepend, append }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Development Preview</title>
  <!-- Start: User Prepend Scripts -->
  ${prepend.reduce((acc, script) => `${acc}<script src="${script}"></script>`, '')}
  <!-- End: User Prepend Scripts -->
</head>

<body>
  <div id="app">
    <develop-preview></develop-preview>
  </div>

  <!-- Start: Dev-Preview Plugin Style and Scripts -->
  <link rel="stylesheet" href="./${output}/dev-preview.css">
  <script src="https://unpkg.com/vue@2.6.10/dist/vue.js"></script>
  <script src="https://unpkg.com/vue-router@3.1.3/dist/vue-router.js"></script>
  <script>;__BIOTOPE_DEV_PREVIEW_ROOT="${output}";</script>
  <script src="./${output}/dev-preview.js"></script>
  <!-- End: Dev-Preview Plugin Style and Scripts -->

  <!-- Start: User Append Scripts -->
  ${append.reduce((acc, script) => `${acc}<script src="${script}"></script>`, '')}
  <!-- End: User Append Scripts -->
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
  const templateHtml = pluginConfig.template ? readFileSync(pluginConfig.template) : template({
    output, prepend, append,
  });
  
  const projectConfig = {};
  let isFirstTime = true;
  return [
    saveConfig(projectConfig),
    copyPlugin(() => ([
      {
        from: `${__dirname}/files`,
        to: `${projectConfig.output}/${output}`,
        ignore: [],
      },
      {
        from: `${projectConfig.project}/${assets}`,
        to: `${projectConfig.output}/${output}`,
        ignore: [],
      },
    ])),
    onBundleEnd(() => {
      if (isFirstTime) {
        isFirstTime = false;
        outputFileSync(`${projectConfig.output}/index.html`, templateHtml);
      }
    }),
  ];
}

module.exports = devPreviewPlugin;
