import { copyFilesTo } from './copyFilesTo';
import { watch } from 'chokidar';

export const copyAndWatchTo = (folder: string, isServing: boolean) => (
  glob: string,
): void => {
  const moveFilesToFolder = copyFilesTo(folder);
  moveFilesToFolder(glob);
  if(isServing) {
    watch(glob).on('all', moveFilesToFolder);
  }
};
