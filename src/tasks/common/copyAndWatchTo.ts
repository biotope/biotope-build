import { watch } from 'chokidar';
import { copyFilesTo } from './copyFilesTo';

export const copyAndWatchTo = (folder: string, shouldWatch: boolean) => (
  glob: string,
): void => {
  const moveFilesToFolder = copyFilesTo(folder);
  moveFilesToFolder(glob);
  if(shouldWatch) {
    watch(glob).on('all', moveFilesToFolder);
  }
};
