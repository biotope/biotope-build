import { RollupWarning, RollupOptions } from 'rollup';
import { resolver } from '../resolver';
import { createInputs } from '../create-inputs';
import { manualChunks } from '../manual-chunks';
import { getContent } from '../require';
import {
  ParsedOptions, LegacyOptions, Build, PostBuild, OutputFile,
} from '../types';
import {
  babel, commonJs, postcss, nodeResolve, typescript, bundleExtract,
} from './plugins/config';
import { InnerPlugin, innerPlugins } from './plugins';

const getLegacyBanner = (config: ParsedOptions, legacy: boolean): string => (
  legacy && (config.legacy as LegacyOptions).inline ? getContent(true) : ''
);

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
      priorityPlugins: [],
      plugins: [],
      pluginsConfig: {
        postcss: [postcss(config, legacy)],
        commonjs: [commonJs()],
        nodeResolve: [nodeResolve(config)],
        typescript: !legacy ? [typescript()] : undefined,
        babel: legacy ? [babel(config)] : undefined,
        terser: config.production ? [] : undefined,
        json: [],
        bundleExtract: [bundleExtract(config, legacy, outputFiles)],
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
