import { BuildConfig } from './../../types';
import { removeFolder } from '../../common';

export default async (buildConfig: BuildConfig) => {
  await removeFolder(buildConfig.paths.distFolder);
}