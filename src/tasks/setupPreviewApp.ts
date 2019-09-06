import { BuildConfig, BuildTask } from './../types';
import { createPreviewAppTo } from './common/create-preview-app-to';

export const setupPreviewApp: BuildTask = async (config: BuildConfig, watch: boolean) => {
  return createPreviewAppTo(config.paths.distFolder)(config.serve.layoutFile)
}