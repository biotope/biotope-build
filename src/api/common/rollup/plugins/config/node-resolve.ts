import { ParsedOptions } from '../../../types';

export const nodeResolve = (config: ParsedOptions): object => ({
  browser: true,
  extensions: config.extLogic,
});
