import { existsSync } from 'fs';

import { createComponentJsonTo } from './create-component-json-to';
import { copyAndWatchTo } from './copy-and-watch-to';
import { renderPreviewEjsTo } from './render-preview-ejs-to';

const previewPath = '/../../devPreview/';
const createPreviewPath = (path: string) => `${__dirname}${previewPath}${path}`;

export const createPreviewAppTo = (folder: string) => {
  const createComponentJsonToTmp = createComponentJsonTo(folder);
  const copyWatchToTmp = copyAndWatchTo(folder);
  const renderEjsToTemp = renderPreviewEjsTo(folder);
  return (layoutFile: string) => {
    createComponentJsonToTmp();
    copyWatchToTmp(`src/**/*.html`);
    const previewFiles = [
      createPreviewPath('*.js'),
      createPreviewPath('*.css'),
      createPreviewPath('**/*.png'),
    ];
    copyWatchToTmp(previewFiles)

    const projectIndexFileLocation = `${process.cwd()}/${ layoutFile}`;
    const indexPagePath = existsSync(projectIndexFileLocation) ? projectIndexFileLocation : createPreviewPath('index.ejs');

    renderEjsToTemp(indexPagePath);
  };
}
