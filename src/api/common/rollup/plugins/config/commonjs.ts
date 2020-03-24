import { ParsedOptions } from '../../../types';

export const commonJs = (config: ParsedOptions): object => ({
  include: /node_modules/,
  extensions: config.extLogic,
  namedExports: {},
});
