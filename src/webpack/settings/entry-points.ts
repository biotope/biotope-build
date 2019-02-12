import { existsSync } from 'fs';
import { resolve } from 'path';
import { EntryPointOption, Settings, EntryPoint } from './types';

export const getEntryPoints = (entryPoint: EntryPointOption, paths: Settings['paths']): EntryPoint => {
  let filename = '';
  [/\.ts$/, /\.tsx$/, /\.js$/].some((regex) => {
    if (regex.test(entryPoint.file)) {
      filename = entryPoint.file.replace(regex, '');
      return true;
    }
    return false;
  });

  const template = resolve(`${paths.pagesAbsolute}/${
    entryPoint.template || `${filename}.template.ejs`
  }`);
  const hasTemplate = existsSync(template);

  return {
    file: entryPoint.file,
    template: hasTemplate ? template : resolve(`${paths.assetsAbsolute}/template.ejs`),
    filename: resolve(`${paths.distAbsolute}/${
      (!(/\/index$/.test(filename)) && filename !== 'index') ? `${filename}/index` : filename
    }.html`),
  };
};
