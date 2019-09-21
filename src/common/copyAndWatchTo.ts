import { copyFilesTo } from './copyFilesTo';
import { watch } from 'chokidar';

export const copyAndWatchTo = (folder: string, isServing: boolean) => async (
  glob: string,
): Promise<void> => {
  const moveFilesToFolder = copyFilesTo(folder);
  if(isServing) {
    watch(glob).on('all', moveFilesToFolder);
  } else {
    await moveFilesToFolder(glob);
  }
};
