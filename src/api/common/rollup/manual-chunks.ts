import { sep } from 'path';
import { ManualChunksOption } from 'rollup';
import { ParsedOptions } from '../types';

const bundleOverrides = ['commonjsHelpers.js', 'rollupPluginBabelHelpers.js'];

const nodoModulesFolder = `node_modules${sep}`;

export const invertObject = (vendors: Record<string, string[]>): Record<string, string> => Object
  .keys(vendors)
  .reduce((accumulator, name): Record<string, string> => ({
    ...accumulator,
    ...(vendors[name].reduce((acc, vendor): Record<string, string> => ({
      ...acc,
      [vendor]: name,
    }), {})),
  }), {});

export const manualChunks = (
  folder: string, config: ParsedOptions, isLegacyBuild: boolean,
): ManualChunksOption => {
  const suffix = isLegacyBuild && config.legacy ? config.legacy.suffix : '';
  const invertedChunks = invertObject(config.chunks || {});
  const invertedChunksKeys = Object.keys(invertedChunks);
  const bundleFile = `${folder}/bundle${suffix}`;

  return (path: string): string | undefined => {
    const relativePath = path
      .replace(process.cwd(), '')
      .split('/')
      .filter((slug): boolean => !!slug)
      .join('/');

    // eslint-disable-next-line no-control-regex
    const pathClean = path.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    const hasDelimiters = pathClean !== path;

    if (relativePath.includes('node_modules')) {
      const libPath = relativePath.slice(
        relativePath.indexOf(nodoModulesFolder) + nodoModulesFolder.length,
      );
      const lib = libPath.split(sep).splice(0, libPath.indexOf('@') === 0 ? 2 : 1).join(sep);

      return !invertedChunksKeys.includes(lib)
        ? bundleFile
        : `${folder}/${invertedChunks[lib].split('/').join('-')}${suffix}`;
    }

    return (hasDelimiters || bundleOverrides.includes(pathClean)) ? bundleFile : undefined;
  };
};
