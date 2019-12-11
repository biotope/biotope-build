import { resolve } from 'path';
import { existsSync } from 'fs-extra';
import {
  Options,
  ParsedOptions,
  PluginRow,
  PluginEvent,
  PluginRowSimple,
  PluginRowMaker,
  ParsedOptionsConfig,
  CopyItem,
} from './types';
import { defaultCliOptions, defaultConfigs, defaultPlugins } from './defaults';

export const toThenable = (object: void | Promise<void>): Promise<void> => {
  if (object && object.then && typeof object.then === 'function') {
    return new Promise((resolvePromise) => object.then(() => resolvePromise()));
  }
  return object as Promise<void>;
};

const kebabToCamel = (string: string): string => string.replace(/-([a-z])/g, (_, item): string => item.toUpperCase());

const toArray = (obj: string): string[] => obj.split(',').filter((p): boolean => !!p);

// eslint-disable-next-line import/no-dynamic-require,global-require
const getConfig = <T>(file: string): T => require(resolve(file));

const setByPriority = <T>(
  config: Record<string, T>, prop: string, cliValue: T, defaultValue: T, t?: (_: T) => T,
): void => {
  if (cliValue !== undefined) {
    // eslint-disable-next-line no-param-reassign
    config[prop] = t ? t(cliValue) : cliValue;
  } else if (config[prop] === undefined) {
    // eslint-disable-next-line no-param-reassign
    config[prop] = t ? t(defaultValue) : defaultValue;
  }
};

const setObjectByPriority = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>, prop: string, cliValue: any, defaultValue: any,
): void => {
  const defaultConfig = defaultConfigs[prop as keyof ParsedOptionsConfig];
  setByPriority(config, prop, cliValue, defaultValue, (value) => (value ? defaultConfig : false));
  if ((config[prop] as boolean) === true) {
    // eslint-disable-next-line no-param-reassign
    config[prop] = defaultConfig;
  } else if (typeof config[prop] === 'object') {
    // eslint-disable-next-line no-param-reassign
    config[prop] = {
      ...defaultConfig,
      ...config[prop],
    };
  }
};

export const parseOptions = (cliOptions: Partial<Options>): ParsedOptions => {
  let configFile: Partial<ParsedOptions> = {};
  if (cliOptions.config) {
    const resolved = resolve(cliOptions.config);
    if (existsSync(resolved)) {
      configFile = getConfig<Partial<ParsedOptions>>(resolved);
    } else {
      // eslint-disable-next-line no-console
      console.error(`Config file "${resolved}" does not exist…`);
    }
  }

  setByPriority(configFile, 'project', cliOptions.project, defaultCliOptions.project);
  setByPriority(configFile, 'exclude', cliOptions.exclude, defaultCliOptions.exclude, toArray);
  setByPriority(configFile, 'output', cliOptions.output, defaultCliOptions.output);
  setByPriority(configFile, 'copy', cliOptions.copy, defaultCliOptions.copy, toArray);
  setByPriority(configFile, 'watch', cliOptions.watch, defaultCliOptions.watch);
  setByPriority(configFile, 'production', cliOptions.production, defaultCliOptions.production);
  setByPriority(configFile, 'componentsJson', cliOptions.componentsJson, defaultCliOptions.componentsJson);
  setByPriority(configFile, 'extLogic', cliOptions.extLogic, defaultCliOptions.extLogic, toArray);
  setByPriority(configFile, 'extStyle', cliOptions.extStyle, defaultCliOptions.extStyle, toArray);
  setObjectByPriority(configFile, 'legacy', cliOptions.legacy, defaultCliOptions.legacy);
  setObjectByPriority(configFile, 'serve', cliOptions.serve, defaultCliOptions.serve);
  setObjectByPriority(configFile, 'chunks', undefined, defaultConfigs.chunks);
  setObjectByPriority(configFile, 'runtime', undefined, defaultConfigs.runtime);

  configFile.copy = (configFile as ParsedOptions).copy.map((item: string | Partial<CopyItem>) => ({
    from: typeof item === 'string' ? `${configFile.project}/${item}` : item.from || '',
    to: typeof item === 'string' ? `${configFile.output}/${item}` : item.to || 'vendor',
    ignore: typeof item === 'string' || !item.ignore ? [] : item.ignore,
  })).filter((item) => item.from);

  configFile.plugins = [
    ...(configFile.plugins || []),
    ...defaultPlugins.map((pluginName) => {
      const plugin = getConfig<PluginRowMaker>(`${__dirname}/../../../plugins/${pluginName}`);
      const pluginConfig = (configFile as Record<string, object>)[
        kebabToCamel(pluginName) as keyof typeof configFile
      ];
      return plugin(pluginConfig !== undefined ? pluginConfig : {});
    }),
  ];

  return configFile as ParsedOptions;
};

export const getPlugins = (plugins: PluginRow[], name: PluginEvent): PluginRowSimple[] => plugins
  .reduce((accumulator, plugin) => [
    ...accumulator,
    ...(typeof plugin[0] === 'string' ? [plugin as PluginRowSimple] : plugin as PluginRowSimple[]),
  ], []).filter(([event]) => event === name);
