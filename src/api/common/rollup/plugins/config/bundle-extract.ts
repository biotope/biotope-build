import { ParsedOptions, LegacyOptions } from '../../../types';
import { BundleExtractPluginOptions } from '../types';

export const bundleExtract = (
  config: ParsedOptions, isLegacyBuild: boolean, addFile: BundleExtractPluginOptions['addFile'],
): BundleExtractPluginOptions => ({
  isLegacyBuild,
  production: config.production,
  style: config.style,
  legacy: isLegacyBuild ? config.legacy as LegacyOptions : undefined,
  addFile,
});
