import { resolve } from 'path';
import { readFileSync } from 'fs-extra';
import {
  OutputOptions, RollupWarning, OutputBundle, RollupOptions, OutputAsset, OutputChunk,
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
import { removeOutputFile, addOutputFile } from './emit';
import {
  ParsedOptions, LegacyOptions, Build, PostBuild, OutputFile,
} from './types';

const requirePath = resolve(`${__dirname}/../../require.min.js`);

const getLegacyBanner = (config: ParsedOptions, legacy: boolean): string => (
  legacy && (config.legacy as LegacyOptions).inline
    ? readFileSync(requirePath).toString()
    : ''
);

const getOutputContent = (output: OutputAsset | OutputChunk): string | Buffer => {
  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output.type === 'asset' || (output as any).isAsset)
    && (typeof (output as OutputAsset).source === 'string' || (output as OutputAsset).source !== undefined)
  ) {
    return (output as OutputAsset).source;
  }

  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output.type === 'chunk' || (output as any).isAsset === undefined)
    && (typeof (output as OutputChunk).code === 'string' || (output as OutputChunk).code !== undefined)
  ) {
    return (output as OutputChunk).code;
  }

  return '';
};

const createBuild = (config: ParsedOptions, legacy: boolean): Build => {
  const warnings: Record<string, RollupWarning[]> = {};
  const outputFiles: Record<string, OutputFile> = {};

  return {
    build: {
      input: createInputs(
        config.project,
        config.extLogic,
        legacy ? (config.legacy as LegacyOptions).suffix : '',
        resolver(config.exclude.map((folder) => `${config.project}/${folder}`), false, config.extLogic),
      ),
      onwarn(warning: RollupWarning): void {
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
              const content = getOutputContent(bundle[key]);

              addOutputFile(key, content, outputFiles);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              removeOutputFile(key, bundle as Record<string, any>);
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
