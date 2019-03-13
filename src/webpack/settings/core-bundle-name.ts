import { resolve } from 'path';
import { existsSync } from 'fs';

const getRandomName = (length: number = 16): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let text = '';

  while (text.length < length) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const getCoreBundleName = (): string => {
  const packageJson = resolve(`${process.cwd()}/package.json`);
  let name = '';

  if (existsSync(packageJson)) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    ({ name } = require(packageJson));
  }
  return name || getRandomName();
};
