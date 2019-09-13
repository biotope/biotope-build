import { BuildConfig, BuildTask } from './../types';
import { createPreviewAppTo } from './common/createPreviewAppTo';

export const setupPreviewApp: BuildTask = async (config: BuildConfig, watch: Function) => {
  createPreviewAppTo(config.paths.distFolder, watch)(config.serve.layoutFile)
}