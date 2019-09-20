import { BuildConfig, BuildTask } from './../types';
import { createPreviewAppTo } from '../common/createPreviewAppTo';

export const setupPreviewApp: BuildTask = async (config: BuildConfig, isServing: boolean) => {
  createPreviewAppTo(config.paths.distFolder, isServing)(config.serve.layoutFile)
}