import { resolve } from 'path';
import { resolver } from '../resolver';

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

export const createInputs = (
  folder: string, extensions: string[], suffix: string, excludes: string[],
): Record<string, string> => (
  resolver([folder], false, extensions).reduce((accumulator, files) => ([
    ...accumulator,
    ...(typeof files === 'string' ? [files] : files),
  ]), []).reduce((accumulator, file): Record<string, string> => ({
    ...accumulator,
    ...(excludes.indexOf(resolve(file)) >= 0 ? {} : {
      [`${getOutputName(file, folder)}${suffix}`]: resolve(file),
    }),
  }), {})
);
