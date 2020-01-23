import { resolve } from 'path';
import { readFileSync } from 'fs';
import {
  OutputOptions, RollupWarning, OutputBundle, RollupOptions,
} from 'rollup';
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
import {
  ParsedOptions, LegacyOptions, Build, PostBuild,
} from './types';

const requirePath = resolve(`${__dirname}/../../require.min.js`);

const getLegacyBanner = (config: ParsedOptions, legacy: boolean): string => (
  legacy && (config.legacy as LegacyOptions).inline
    ? readFileSync(requirePath).toString()
    : ''
);

const createBuild = (config: ParsedOptions, legacy: boolean): Build => {
  const warnings: Record<string, RollupWarning[]> = {};
  const outputFiles: Record<string, string | Buffer> = {};

  return {
    build: {
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
          name: 'biotope-build-rollup-plugin-extract',
          generateBundle(_: OutputOptions, bundle: OutputBundle): void {
            Object.keys(bundle).forEach((key) => {
              // TODO: try "if (isAsset) then 'source' else 'code'"

              // eslint-disable-next-line no-param-reassign
              outputFiles[key] = (bundle[key] as any).code || (bundle[key] as any).source || '';
              // eslint-disable-next-line no-param-reassign
              delete bundle[key];
            });

            // TODO: add banners if "no-code-split"?
          },
        },
      ],
      priorityPlugins: [],
      pluginsConfig: {
        postcss: [getPostcssConfig(config, legacy)],
        commonjs: [getCommonjsConfig()],
        nodeResolve: [getNodeResolverConfig(config)],
        typescript: !legacy ? [getTypescriptConfig()] : undefined,
        babel: legacy ? [getBabelConfig(config)] : undefined,
        terser: config.production ? [] : undefined,
        json: [],
      },
      manualChunks: manualChunks('vendor', config.chunks || {}, legacy ? config.legacy as LegacyOptions : false),
    },
    warnings,
    outputFiles,
  };
};

export const createPreBuilds = (config: ParsedOptions): Build[] => ([
  createBuild(config, false),
  ...(config.legacy ? [createBuild(config, true)] : []),
]);

export const finalizeBuilds = (builds: Build[]): PostBuild[] => {
  const rollupBuilds = builds
    .reduce((accumulator, { build }) => ([...accumulator, Object.keys(build).reduce((acc, key) => ({
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
    }), {})] as RollupOptions[]), []);

  return builds.map((_, index) => ({
    build: rollupBuilds[index],
    outputFiles: builds[index].outputFiles,
    warnings: builds[index].warnings,
  }));
};
