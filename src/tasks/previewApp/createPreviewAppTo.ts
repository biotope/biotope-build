import { existsSync } from 'fs';
import { createComponentJsonTo } from '../../common/createComponentJsonTo';
import { copyAndWatchTo } from '../../common/copyAndWatchTo';
import { renderPreviewEjsTo } from './renderPreviewEjsTo';
import { watch } from 'chokidar';

const previewPath = '/dev-preview/';
const createPreviewPath = (path: string): string => `${__dirname}${previewPath}${path}`;

type CreatePreviewApp = (_: string) => void;

export const createPreviewAppTo = (folder: string, isServing: boolean): CreatePreviewApp => {
  const createComponentJson = createComponentJsonTo(folder);
  const copyWatch = copyAndWatchTo(folder, isServing);
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
    if(isServing) {
      watch(indexPagePath).on('all', () => {
        renderEjs(indexPagePath);
      });
    }
    renderEjs(indexPagePath);
    
  };
};
