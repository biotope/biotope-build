import { existsSync } from 'fs';
import { createComponentJsonTo } from './createComponentJsonTo';
import { copyAndWatchTo } from './copyAndWatchTo';
import { renderPreviewEjsTo } from './renderPreviewEjsTo';

const previewPath = '/../../dev-preview/';
const createPreviewPath = (path: string): string => `${__dirname}${previewPath}${path}`;

type CreatePreviewApp = (_: string) => void;

export const createPreviewAppTo = (folder: string, watch: Function): CreatePreviewApp => {
  const createComponentJson = createComponentJsonTo(folder);
  const copyWatch = copyAndWatchTo(folder, watch);
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
    watch(indexPagePath).on('all', () => {
      renderEjs(indexPagePath);
    });
    renderEjs(indexPagePath);
    
  };
};
