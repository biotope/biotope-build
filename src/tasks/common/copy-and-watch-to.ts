import { watch } from 'gulp';
import { moveFilesTo } from './move-files-to';

type CopyAndWatch = (_: string[] | string) => void;

export const copyAndWatchTo = (folder: string): CopyAndWatch => (
  globs: string[] | string,
): void => {
  const moveFilesToFolder = moveFilesTo(folder);
  moveFilesToFolder(globs);
  watch(globs).on('change', moveFilesToFolder);
};
