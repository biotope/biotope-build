import { resolve } from 'path';
import { existsSync } from 'fs-extra';
import * as deepmerge from 'deepmerge';

const MINIMAL_TYPESCRIPT_CONFIG = {
  compilerOptions: {
    esModuleInterop: true,
  },
};

const MANDATORY_TYPESCRIPT_CONFIG = {
  compilerOptions: {
    target: 'ES6',
  },
};

const MANDATORY_TYPESCRIPT_CONFIG_DELETIONS = ['include', 'exclude'];

export const getTypescriptConfig = (): object => {
  const configFile = resolve(`${process.cwd()}/tsconfig.json`);

  const tsconfig: RecordAny = configFile && existsSync(configFile)
    // eslint-disable-next-line import/no-dynamic-require,global-require
    ? require(configFile)
    : MINIMAL_TYPESCRIPT_CONFIG;

  MANDATORY_TYPESCRIPT_CONFIG_DELETIONS.forEach((key) => {
    tsconfig[key] = undefined;
  });

  return {
    // eslint-disable-next-line global-require
    typescript: require('typescript'),
    tsconfigOverride: deepmerge(tsconfig, MANDATORY_TYPESCRIPT_CONFIG),
  };
};
