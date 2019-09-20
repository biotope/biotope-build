import { BuildConfig, BuildTask } from './../types';
import { removeFolder } from '../common/remove-folder';
export const clean: BuildTask = async (config: BuildConfig) => {
  await removeFolder(config.paths.distFolder);
}