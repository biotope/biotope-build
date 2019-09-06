import { BuildConfig, BuildTask } from './../types';
import { removeFolder } from './common/remove-folder';
export const clean: BuildTask = async (config: BuildConfig, watch: boolean) => {
  await removeFolder(config.paths.distFolder);
}