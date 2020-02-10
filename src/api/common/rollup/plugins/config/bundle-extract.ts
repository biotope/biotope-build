import { ParsedOptions, LegacyOptions } from '../../../types';
import { BundleExtractPluginOptions } from '../types';

export const bundleExtract = (
  config: ParsedOptions, isLegacyBuild: boolean, addFile: BundleExtractPluginOptions['addFile'],
): BundleExtractPluginOptions => ({
  legacy: isLegacyBuild,
  isInline: isLegacyBuild ? (config.legacy as LegacyOptions).inline : false,
  styleExtracted: config.style.extract,
  production: config.production,
  suffix: isLegacyBuild && config.legacy && !config.legacy.only ? (config.legacy as LegacyOptions).suffix : '',
  addFile,
});
