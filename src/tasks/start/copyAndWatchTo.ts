import { watch } from 'gulp';
import moveFilesTo from '../common/moveFilesTo';

const copyAndWatchTo = (folder: string) => (globs: string[] | string) => {
  const moveFilesToFolder = moveFilesTo(folder);
  moveFilesToFolder(globs);
  watch(globs).on('change', moveFilesToFolder);
}

export default copyAndWatchTo;