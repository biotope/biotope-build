import { watch } from 'gulp';
import { moveFilesTo } from './move-files-to';

export const copyAndWatchTo = (folder: string) => (globs: string[] | string) => {
  const moveFilesToFolder = moveFilesTo(folder);
  moveFilesToFolder(globs);
  watch(globs).on('change', moveFilesToFolder);
}
