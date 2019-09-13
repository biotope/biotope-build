import { copyFilesTo } from './copyFilesTo';

export const copyAndWatchTo = (folder: string, watch: Function) => (
  glob: string,
): void => {
  const moveFilesToFolder = copyFilesTo(folder);
  moveFilesToFolder(glob);
  if(watch) {
    watch(glob).on('all', moveFilesToFolder);
  }
};
