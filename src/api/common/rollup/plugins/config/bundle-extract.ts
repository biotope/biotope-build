import { ParsedOptions, OutputFile, LegacyOptions } from '../../../types';

export const bundleExtract = (
  config: ParsedOptions, isLegacyBuild: boolean, outputFiles: Record<string, OutputFile>,
): object => ({
  legacy: isLegacyBuild,
  isInline: isLegacyBuild ? (config.legacy as LegacyOptions).inline : false,
  production: config.production,
  outputFiles,
});
