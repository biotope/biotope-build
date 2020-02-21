import { resolve } from 'path';
import { resolver } from '../resolver';
import { ParsedOptions } from '../types';

const getOutputName = (file: string, folder: string): string => {
  const split = file.replace(resolve(`${process.cwd()}${folder ? `/${folder}` : ''}`), '')
    .split('/')
    .filter((slug): boolean => !!slug);

  const nameSplit = split[split.length - 1].split('.');
  nameSplit.pop();
  split[split.length - 1] = nameSplit.join('.');

  while (split.length > 1 && split[split.length - 1] === 'index') {
    split.pop();
  }
  return split.join('/');
};

export const createInputs = (config: ParsedOptions, legacy: boolean): Record<string, string> => {
  const suffix = config.legacy && legacy ? config.legacy.suffix : '';
  const excludes = resolver(config.exclude.map((folder) => `${config.project}/${folder}`), false, config.extLogic);

  return resolver(config.project, false, config.extLogic).reduce((accumulator, files) => ([
    ...accumulator,
    ...(typeof files === 'string' ? [files] : files),
  ]), []).reduce((accumulator, file): Record<string, string> => ({
    ...accumulator,
    ...(excludes.indexOf(resolve(file)) >= 0 ? {} : {
      [`${getOutputName(file, config.project)}${suffix}`]: resolve(file),
    }),
  }), {});
};
