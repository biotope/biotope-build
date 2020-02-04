import { ParsedOptions } from '../../../types';

export const alias = (config: ParsedOptions): object => ({
  entries: Object.keys(config.alias).map((key) => ({
    find: key,
    replacement: config.alias[key],
  })),
});
