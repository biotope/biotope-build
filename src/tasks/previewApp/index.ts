import { BuildConfig } from '../../types';
import { createPreviewAppTo } from './createPreviewAppTo';

export default async (config: BuildConfig, isServing: boolean) => {
  createPreviewAppTo(config.paths.distFolder, isServing)(config.serve.layoutFile)
}