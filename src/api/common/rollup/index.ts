import { RollupWarning, RollupOptions } from 'rollup';
import { readFileSync, writeFileSync } from 'fs-extra';
import { getContent } from '../require';
import { getAddFileFunction, getRemoveFileFunction } from '../emit';
import {
  ParsedOptions, Build, PostBuild, OutputFile, OutputFileInfo,
} from '../types';
import { createInputs } from './create-inputs';
import { manualChunks } from './manual-chunks';
import {
  alias, babel, commonJs, postcss, nodeResolve, typescript, exclude, bundleExtract, replace,
} from './plugins/config';
import { InnerPlugin, innerPlugins } from './plugins';

const getBanner = (config: ParsedOptions, legacy: boolean): string => (
  legacy && config.legacy && config.legacy.require && config.legacy.require !== 'file' ? getContent(!config.debug) : ''
);

const createBuild = (
  config: ParsedOptions,
  legacy: boolean,
  input: Record<string, string>,
  outputFiles: Record<string, OutputFile>,
  warnings: Record<string, RollupWarning[]>,
  extractedStyle: Record<string, string>,
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
      exports: 'named',
      chunkFileNames: '[name].js',
      banner: getBanner(config, legacy),
      sourcemap: true,
      esModule: false,
    },
    priorityPlugins: [],
    plugins: [],
    pluginsConfig: {
      alias: [alias(config)],
      postcss: [postcss(config, extractedStyle)],
      replace: [replace(legacy)],
      commonjs: [commonJs(config)],
      nodeResolve: [nodeResolve(config)],
      exclude: [exclude(config, legacy)],
      typescript: !legacy ? [typescript()] : undefined,
      babel: legacy ? [babel(config)] : undefined,
      json: [],
      terser: config.production ? [] : undefined,
      bundleExtract: [bundleExtract(config, legacy, extractedStyle, addFile)],
    },
    watch: {
      chokidar: true,
    },
    manualChunks: manualChunks('vendor', config, legacy),
  },
  legacy,
  warnings,
  outputFiles,
  addFile,
  removeFile,
  triggerBuild,
});

export const createPreBuilds = (config: ParsedOptions): Build[] => {
  const outputFiles: Record<string, OutputFile> = {};
  const warnings: Record<string, RollupWarning[]> = {};
  const extractedStyle: Record<string, string> = {};
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
    outputFiles,
    warnings,
    extractedStyle,
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
