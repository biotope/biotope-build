import { ServeConfig } from '../common/config';
import * as fs from 'fs';

import createComponentJsonTo from "./createComponentJsonTo";
import copyAndWatchTo from './copyAndWatchTo';
import renderPreviewEjsTo from './renderPreviewEjsTo';

const previewPath = '/../../devPreview/';
const createPreviewPath = (path: string) => `${__dirname}${previewPath}${path}`;

const createPreviewAppTo = (folder: string) => {
  const createComponentJsonToTmp = createComponentJsonTo(folder);
  const copyWatchToTmp = copyAndWatchTo(folder);
  const renderEjsToTemp = renderPreviewEjsTo(folder);
  return (layoutFile: string) => {
    createComponentJsonToTmp();
    copyWatchToTmp(`src/**/*.html`);
    const previewFiles = [
      createPreviewPath('*.js'),
      createPreviewPath('*.css'),
    ];
    copyWatchToTmp(previewFiles)
  
    const projectIndexFileLocation = `${process.cwd()}/${ layoutFile}`;
    const indexPagePath = fs.existsSync(projectIndexFileLocation) ? projectIndexFileLocation : createPreviewPath('index.ejs');

    renderEjsToTemp(indexPagePath);
  };
}

export default createPreviewAppTo;