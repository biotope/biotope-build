import { watch } from 'chokidar';
import { copyFilesTo } from './copyFilesTo';

export const copyAndWatchTo = (folder: string) => (
  glob: string,
): void => {
  const moveFilesToFolder = copyFilesTo(folder);
  moveFilesToFolder(glob);
  watch(glob).on('all', moveFilesToFolder);
};
