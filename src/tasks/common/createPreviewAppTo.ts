import { existsSync } from 'fs';
import { createComponentJsonTo } from './createComponentJsonTo';
import { copyAndWatchTo } from './copyAndWatchTo';
import { renderPreviewEjsTo } from './renderPreviewEjsTo';
import { watch } from 'chokidar';

const previewPath = '/../../dev-preview/';
const createPreviewPath = (path: string): string => `${__dirname}${previewPath}${path}`;

type CreatePreviewApp = (_: string) => void;

export const createPreviewAppTo = (folder: string, shouldWatch: boolean): CreatePreviewApp => {
  const createComponentJson = createComponentJsonTo(folder);
  const copyWatch = copyAndWatchTo(folder, shouldWatch);
  const renderEjs = renderPreviewEjsTo(folder);

  return (layoutFile: string): void => {
    createComponentJson();
    copyWatch('src/**/*.html');
    copyWatch(createPreviewPath('*.js'));
    copyWatch(createPreviewPath('*.css'));
    copyWatch(createPreviewPath('**/*.png'));

    const projectIndexFileLocation = `${process.cwd()}/${layoutFile}`;
    const indexPagePath = existsSync(projectIndexFileLocation)
      ? projectIndexFileLocation
      : createPreviewPath('index.ejs');
    renderEjs(indexPagePath);
    if(shouldWatch) {
      watch(indexPagePath).on('all', () => {
        renderEjs(indexPagePath);
      });
    }
    
  };
};
