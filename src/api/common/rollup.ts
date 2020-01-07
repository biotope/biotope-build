import { resolve } from 'path';
import { readFileSync } from 'fs';
import { RollupOptions, OutputOptions, RollupWarning } from 'rollup';
import {
  innerPlugins,
  InnerPlugin,
  getBabelConfig,
  getCommonjsConfig,
  getPostcssConfig,
  getNodeResolverConfig,
  getTypescriptConfig,
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

const createBuild = (
  config: ParsedOptions, legacy: boolean, warnings: Record<string, RollupWarning[]> = {},
): PreRollupOptions => ({
  input: createInputs(
    config.project,
    config.extLogic,
    legacy ? (config.legacy as LegacyOptions).suffix : '',
    resolver(config.exclude.map((folder) => `${config.project}/${folder}`), false, config.extLogic),
  ),
  onwarn(warning: RollupWarning): void {
    // eslint-disable-next-line no-param-reassign
    warnings[warning.code || 'BIOTOPE_BUILD_UNKNOWN'] = [
      ...(warnings[warning.code || 'BIOTOPE_BUILD_UNKNOWN'] || []),
      warning,
    ];
  },
  output: {
    dir: config.output,
    format: !legacy ? 'esm' : 'cjs',
    chunkFileNames: '[name].js',
    banner: getLegacyBanner(config, legacy),
    sourcemap: !config.production,
  },
  plugins: [
    {
      name: 'biotope-build-cleanup',
      generateBundle(_: OutputOptions, bundle: Record<string, object>): void {
        (warnings.EMPTY_BUNDLE || []).forEach((warning) => {
          if (warning.chunkName) {
            // eslint-disable-next-line no-param-reassign
            delete bundle[`${warning.chunkName}.js`];
          }
        });
      },
    },
  ],
  priorityPlugins: [],
  pluginsConfig: {
    postcss: [getPostcssConfig(config)],
    commonjs: [getCommonjsConfig()],
    nodeResolve: [getNodeResolverConfig(config)],
    typescript: !legacy ? [getTypescriptConfig()] : undefined,
    babel: legacy ? [getBabelConfig(config)] : undefined,
    terser: config.production ? [] : undefined,
    json: [],
  },
  manualChunks: manualChunks('vendor', config.chunks || {}, legacy ? config.legacy as LegacyOptions : false),
  watch: {
    chokidar: true,
  },
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
