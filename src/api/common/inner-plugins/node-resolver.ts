import { ParsedOptions } from '../types';

export const getNodeResolverConfig = (config: ParsedOptions): object => ({
  browser: true,
  extensions: config.extLogic,
});
