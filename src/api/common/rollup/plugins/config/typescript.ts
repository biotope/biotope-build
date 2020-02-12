import { resolve } from 'path';
import { existsSync } from 'fs-extra';
import * as deepmerge from 'deepmerge';
import { requireJson } from '../../../json-handlers';

const MINIMAL_CONFIG_PATH = resolve(`${__dirname}/../../../../../../tsconfig.minimal.json`);
const MINIMAL_CONFIG_CONTENT: object = requireJson(MINIMAL_CONFIG_PATH);
const BUILD_CONFIG_CONTENT = {
  compilerOptions: {
    allowJs: true,
    allowUnreachableCode: true,
    noEmitOnError: false,
  },
};

export const typescript = (): object => {
  const configFile = resolve(`${process.cwd()}/tsconfig.json`);
  const configFileExists = configFile && existsSync(configFile);
  const tsconfig: object = configFileExists ? requireJson(configFile) : MINIMAL_CONFIG_CONTENT;

  return {
    // eslint-disable-next-line global-require
    typescript: require('typescript'),
    tsconfig: !configFileExists ? MINIMAL_CONFIG_PATH : configFile,
    tsconfigOverride: deepmerge(
      deepmerge(MINIMAL_CONFIG_CONTENT, tsconfig) as object,
      BUILD_CONFIG_CONTENT,
    ),
  };
};
