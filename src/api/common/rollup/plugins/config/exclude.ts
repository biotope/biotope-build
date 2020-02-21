import { ParsedOptions, LegacyOptions } from '../../../types';
import { ExcludePluginOptions } from '../types';

export const exclude = (config: ParsedOptions, legacy: boolean): ExcludePluginOptions => ({
  isLegacyBuild: legacy,
  legacy: config.legacy as LegacyOptions,
});
