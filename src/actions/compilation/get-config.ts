import { existsSync } from 'fs';

import { Options } from '../../webpack';

const CONFIG_DEFAULT = 'biotope-build.config.js';

export const getConfig = (config?: string): Options => {
  const configFile = `${process.cwd()}/${config || CONFIG_DEFAULT}`;
  // eslint-disable-next-line global-require,import/no-dynamic-require
  return existsSync(configFile) ? require(configFile) : {};
};
