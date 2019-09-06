import { BuildConfig } from './../types';
import { removeFolder } from './common/remove-folder';
export const clean = async (config: BuildConfig) => {
  return await removeFolder(config.paths.distFolder);
}