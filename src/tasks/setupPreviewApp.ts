import { createPreviewAppTo } from './common/create-preview-app-to';

export const setupPreviewApp = async (config) => {
  return createPreviewAppTo(config.paths.distFolder)(config.serve.layoutFile)
}