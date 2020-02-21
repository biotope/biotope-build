import { ParsedOptions, LegacyOptions } from '../../../types';
import { BundleExtractPluginOptions } from '../types';

export const bundleExtract = (
  config: ParsedOptions,
  isLegacyBuild: boolean,
  extracted: Record<string, string>,
  addFile: BundleExtractPluginOptions['addFile'],
): BundleExtractPluginOptions => ({
  isLegacyBuild,
  production: config.production,
  style: config.style,
  extracted,
  legacy: isLegacyBuild ? config.legacy as LegacyOptions : undefined,
  addFile,
});
