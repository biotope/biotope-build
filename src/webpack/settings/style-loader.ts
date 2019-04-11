import { readFileSync } from 'fs';
import { resolve } from 'path';
import { loader } from 'webpack';
import { stringifyRequest } from 'loader-utils';

import { biotopeLibPath } from './project-paths';

const LOADER_CONTENT_FILE = resolve(`${biotopeLibPath}/webpack/settings/style-loader-content.js`);

// eslint-disable-next-line func-names
const styleLoader: loader.Loader = function (): void {};

// eslint-disable-next-line func-names
styleLoader.pitch = function (request: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = this as any as loader.LoaderContext;
  const content = readFileSync(LOADER_CONTENT_FILE, 'utf8');

  return content.replace('__STYLE__', stringifyRequest(context, `!!${request}`));
};

module.exports = styleLoader;
