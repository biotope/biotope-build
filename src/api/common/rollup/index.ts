import { RollupWarning, RollupOptions } from 'rollup';
import { readFileSync, writeFileSync } from 'fs-extra';
import { resolver } from '../resolver';
import { getContent } from '../require';
import { getAddFileFunction, getRemoveFileFunction } from '../emit';
import {
  ParsedOptions, LegacyOptions, Build, PostBuild, OutputFile,
} from '../types';
import { createInputs } from './create-inputs';
import { manualChunks } from './manual-chunks';
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
  const addFile = getAddFileFunction(config, outputFiles);
  const removeFile = getRemoveFileFunction(outputFiles);
  const input = createInputs(
    config.project,
    config.extLogic,
    legacy ? (config.legacy as LegacyOptions).suffix : '',
    resolver(config.exclude.map((folder) => `${config.project}/${folder}`), false, config.extLogic),
  );

  return {
    build: {
      input,
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
        sourcemap: true, // TODO minor speed-up: disable if maps === false
      },
      priorityPlugins: [],
      plugins: [],
      pluginsConfig: {
        postcss: [postcss(config, legacy)],
        commonjs: [commonJs()],
        nodeResolve: [nodeResolve(config)],
        typescript: !legacy ? [typescript()] : undefined,
        babel: legacy ? [babel(config)] : undefined,
        json: [],
        terser: config.production ? [] : undefined,
        bundleExtract: [bundleExtract(config, legacy, addFile)],
      },
      watch: {
        chokidar: true,
      },
      manualChunks: manualChunks('vendor', config.chunks || {}, legacy ? config.legacy as LegacyOptions : false),
    },
    legacy,
    warnings,
    outputFiles,
    addFile,
    removeFile,
    triggerBuild(file?: string): void {
      if (!legacy && config.watch) {
        const intendedFile = file || input[Object.keys(input)[0]];
        writeFileSync(intendedFile, readFileSync(intendedFile));
      }
    },
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
    legacy: builds[index].legacy,
    outputFiles: builds[index].outputFiles,
    warnings: builds[index].warnings,
    addFile: builds[index].addFile,
    removeFile: builds[index].removeFile,
    triggerBuild: builds[index].triggerBuild,
  }));
};
