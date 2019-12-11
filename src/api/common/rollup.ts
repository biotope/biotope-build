import { resolve } from 'path';
import { readFileSync } from 'fs';
import { RollupOptions } from 'rollup';
import {
  innerPlugins,
  InnerPlugin,
  getBabelConfig,
  getCommonjsConfig,
  getPostcssConfig,
  getNodeResolverConfig,
  getTypescriptConfig,
  getCopyConfig,
} from './inner-plugins';
import { resolver } from './resolver';
import { createInputs } from './create-inputs';
import { manualChunks } from './manual-chunks';
import { ParsedOptions, LegacyOptions, PreRollupOptions } from './types';

const requirePath = resolve(`${__dirname}/../../require.min.js`);

const getLegacyBanner = (config: ParsedOptions, legacy: boolean): string => (
  legacy && (config.legacy as LegacyOptions).inline
    ? readFileSync(requirePath).toString()
    : ''
);

const createBuild = (config: ParsedOptions, legacy: boolean): PreRollupOptions => ({
  input: createInputs(
    config.project,
    config.extLogic,
    legacy ? (config.legacy as LegacyOptions).suffix : '',
    resolver(config.extLogic, config.exclude.map((folder) => `${config.project}/${folder}`)),
  ),
  output: {
    dir: config.output,
    format: !legacy ? 'esm' : 'cjs',
    chunkFileNames: '[name].js',
    banner: getLegacyBanner(config, legacy),
    sourcemap: !config.production,
  },
  plugins: [],
  priorityPlugins: [],
  pluginsConfig: {
    postcss: [getPostcssConfig(config)],
    commonjs: [getCommonjsConfig()],
    nodeResolve: [getNodeResolverConfig(config)],
    typescript: !legacy ? [getTypescriptConfig()] : undefined,
    babel: legacy ? [getBabelConfig(config)] : undefined,
    terser: config.production ? [] : undefined,
    copy: [...getCopyConfig(config, legacy ? requirePath : undefined)],
  },
  manualChunks: manualChunks('vendor', config.chunks || {}, legacy ? config.legacy as LegacyOptions : false),
});

export const createPreBuilds = (config: ParsedOptions): PreRollupOptions[] => ([
  createBuild(config, false),
  ...(config.legacy ? [createBuild(config, true)] : []),
]);

export const finalizeBuilds = (builds: PreRollupOptions[]): RollupOptions[] => builds
  .reduce((accumulator, build) => ([...accumulator, Object.keys(build).reduce((acc, key) => ({
    ...acc,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(key !== 'pluginsConfig' && key !== 'priorityPlugins' ? { [key]: (build as Record<string, any>)[key] } : {}),
    ...(key === 'pluginsConfig' ? {
      plugins: [
        ...(build.priorityPlugins || []),
        ...Object.keys(build.pluginsConfig)
          .filter((name: InnerPlugin) => Array.isArray(build.pluginsConfig[name]))
          .map((name: InnerPlugin) => innerPlugins[name](
            ...(build.pluginsConfig[name] as object[]),
          )),
        ...(build.plugins || []),
      ],
    } : {}),
  }), {})]), []);
