import { resolve } from 'path';
import { existsSync } from 'fs';

import * as tsConfig from '../tsconfig.json';
import { compile } from './compile';

const CONFIG_DEFAULT = './biotope-build.js';
const CONFIG_DEFAULT_TS = CONFIG_DEFAULT.replace('.js', '.ts');

const resolveConfigFile = (configFile?: string): string => {
  if (configFile) {
    if (existsSync(resolve(configFile))) {
      return resolve(configFile);
    }
    throw new Error(`Cannot find configuration file: "${configFile}"`);
  }
  if (existsSync(resolve(CONFIG_DEFAULT_TS))) {
    return resolve(CONFIG_DEFAULT_TS);
  }
  if (existsSync(resolve(CONFIG_DEFAULT))) {
    return resolve(CONFIG_DEFAULT);
  }
  return '';
};

const isTsFile = (file: string): boolean => file.split('.').pop() === 'ts';

export const getConfigFile = (configFile?: string, additionalCompilation?: string): string => {
  if (additionalCompilation) {
    compile([additionalCompilation], tsConfig);
  }

  let actualConfigFile = resolveConfigFile(configFile);

  if (isTsFile(actualConfigFile)) {
    compile([actualConfigFile], tsConfig);
    actualConfigFile = actualConfigFile.replace('.ts', '.js');
  }
  return actualConfigFile;
};
