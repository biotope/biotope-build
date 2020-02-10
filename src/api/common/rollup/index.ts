import { RollupWarning, RollupOptions } from 'rollup';
import { readFileSync, writeFileSync } from 'fs-extra';
import { getContent } from '../require';
import { getAddFileFunction, getRemoveFileFunction } from '../emit';
import {
  ParsedOptions, LegacyOptions, Build, PostBuild, OutputFile, OutputFileInfo,
} from '../types';
import { createInputs } from './create-inputs';
import { manualChunks } from './manual-chunks';
import {
  alias, babel, commonJs, postcss, nodeResolve, typescript, bundleExtract,
} from './plugins/config';
import { InnerPlugin, innerPlugins } from './plugins';

const getLegacyBanner = (config: ParsedOptions, legacy: boolean): string => (
  legacy && (config.legacy as LegacyOptions).inline ? getContent(true) : ''
);

const createBuild = (
  config: ParsedOptions,
  legacy: boolean,
  input: Record<string, string>,
  warnings: Record<string, RollupWarning[]>,
  outputFiles: Record<string, OutputFile>,
  addFile: (file: OutputFileInfo) => void,
  removeFile: (file: string | OutputFileInfo) => void,
  triggerBuild: (file?: string | undefined) => void,
): Build => ({
  build: {
    input,
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
      sourcemap: true,
    },
    priorityPlugins: [],
    plugins: [],
    pluginsConfig: {
      postcss: [postcss(config)],
      commonjs: [commonJs()],
      alias: [alias(config)],
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
  triggerBuild,
});

export const createPreBuilds = (config: ParsedOptions): Build[] => {
  const warnings: Record<string, RollupWarning[]> = {};
  const outputFiles: Record<string, OutputFile> = {};
  const addFile = getAddFileFunction(config, outputFiles);
  const removeFile = getRemoveFileFunction(outputFiles);

  const inputsModules = (!config.legacy || !config.legacy.only)
    ? createInputs(config, false)
    : undefined;
  const inputsLegacy = (!inputsModules || config.legacy) ? createInputs(config, true) : undefined;

  const inputs = [
    ...(inputsModules ? [inputsModules] : []),
    ...(inputsLegacy ? [inputsLegacy] : []),
  ];

  const designatedTriggerInput = inputs[0][Object.keys(inputs[0])[0]];
  const triggerBuild = (file?: string): void => {
    const intendedFile = file || designatedTriggerInput;
    if (config.watch && intendedFile) {
      writeFileSync(intendedFile, readFileSync(intendedFile));
    }
  };
  return inputs.map((input, index) => createBuild(
    config,
    !inputsModules || index > 0,
    input,
    warnings,
    outputFiles,
    addFile,
    removeFile,
    triggerBuild,
  ));
};

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
