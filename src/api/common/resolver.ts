import { statSync } from 'fs';
import { resolve } from 'path';
import { sync as glob } from 'glob';

export const resolver = (
  pattern: string[], includeNodeModules: boolean, extensions?: string[],
): string[] => pattern
  .map((item) => (item.indexOf('*') < 0 && statSync(item).isDirectory() ? `${item}/**/*` : item))
  .map((item) => glob(item))
  .reduce((accumulator, file) => ([
    ...accumulator,
    ...file,
  ]), [])
  .filter((file) => (!includeNodeModules ? file.indexOf('node_modules') < 0 : true))
  .filter((item) => (extensions
    ? extensions.reduce((hasExt, ext) => (new RegExp(`\\${ext}$`)).test(item) || hasExt, false)
    : true))
  .map((item) => resolve(item));
