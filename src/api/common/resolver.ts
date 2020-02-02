import { resolve } from 'path';
import { statSync } from 'fs-extra';
import { sync as glob } from 'glob';

export const resolver = (
  pattern: string | string[], includeNodeModules: boolean, extensions?: string[],
): string[] => (Array.isArray(pattern) ? pattern : [pattern])
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
  .map((item) => resolve(item))
  .filter((item) => !statSync(item).isDirectory());