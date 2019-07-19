import { existsSync } from 'fs';

import { createComponentJsonTo } from './create-component-json-to';
import { copyAndWatchTo } from './copy-and-watch-to';
import { renderPreviewEjsTo } from './render-preview-ejs-to';

const previewPath = '/../../devPreview/';
const createPreviewPath = (path: string): string => `${__dirname}${previewPath}${path}`;

type CreatePreviewApp = (_: string) => void;

export const createPreviewAppTo = (folder: string): CreatePreviewApp => {
  const createComponentJson = createComponentJsonTo(folder);
  const copyWatch = copyAndWatchTo(folder);
  const renderEjs = renderPreviewEjsTo(folder);

  return (layoutFile: string): void => {
    createComponentJson();
    copyWatch('src/**/*.html');
    copyWatch([
      createPreviewPath('*.js'),
      createPreviewPath('*.css'),
      createPreviewPath('**/*.png'),
    ]);

    const projectIndexFileLocation = `${process.cwd()}/${layoutFile}`;
    const indexPagePath = existsSync(projectIndexFileLocation)
      ? projectIndexFileLocation
      : createPreviewPath('index.ejs');

    renderEjs(indexPagePath);
  };
};
