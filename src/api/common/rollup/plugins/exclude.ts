import { Plugin, TransformResult } from 'rollup';
import { ExcludePluginOptions } from './types';

export const exclude = ({ isLegacyBuild, legacy }: ExcludePluginOptions): Plugin => {
  const excludePackages = (!isLegacyBuild && legacy ? legacy.exclusivePackages : [])
    .map((packageName) => `node_modules/${packageName}`);

  return {
    name: 'biotope-build-rollup-plugin-exclude',
    transform: (_, id): TransformResult => (
      excludePackages.some((name) => id.indexOf(name) > -1) ? ({ code: '' }) : undefined
    ),
  };
};
