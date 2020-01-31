import { ManualChunksOption } from 'rollup';
import { LegacyOptions } from '../types';

const invertObject = (vendors: Record<string, string[]>): Record<string, string> => Object
  .keys(vendors)
  .reduce((accumulator, name): Record<string, string> => ({
    ...accumulator,
    ...(vendors[name].reduce((acc, vendor): Record<string, string> => ({
      ...acc,
      [vendor]: name,
    }), {})),
  }), {});

export const manualChunks = (
  folder: string, chunks: Record<string, string[]>, legacy: false | LegacyOptions,
): ManualChunksOption => {
  const invertedChunks = invertObject(chunks);
  const invertedChunksKeys = Object.keys(invertedChunks);

  return (path: string): string | undefined => {
    const relativePath = path
      .replace(process.cwd(), '')
      .split('/')
      .filter((slug): boolean => !!slug)
      .join('/');

    if (relativePath.includes('node_modules')) {
      const libPath = relativePath.slice(relativePath.indexOf('node_modules/') + 'node_modules/'.length);
      const lib = libPath.split('/').splice(0, libPath.indexOf('@') === 0 ? 2 : 1).join('/');

      if (invertedChunksKeys.includes(lib)) {
        return `${folder}/${invertedChunks[lib].split('/').join('-')}${legacy ? legacy.suffix : ''}`;
      }

      return `${folder}/bundle${legacy ? legacy.suffix : ''}`;
    }
    return undefined;
  };
};
