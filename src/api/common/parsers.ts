import { resolve } from 'path';
import { existsSync } from 'fs-extra';
import { defaultCliOptions, defaultConfigs, defaultPlugins } from './defaults';
import {
  Options, ParsedOptions, ParsedOptionsFunction, ParsedOptionsConfig, Plugin,
} from './types';

const kebabToCamel = (string: string): string => string.replace(/-([a-z])/g, (_, item): string => item.toUpperCase());

const toArray = (obj: string): string[] => obj.split(',').filter((p): boolean => !!p);

// eslint-disable-next-line import/no-dynamic-require,global-require
const fetchFile = <T>(file: string): T => require(resolve(file));

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
      ...(defaultConfig as object),
      ...config[prop],
    };
  }
};

export const parseOptions = (cliOptions: Partial<Options>): ParsedOptions => {
  let configFile: Partial<ParsedOptions> = {};
  if (cliOptions.config) {
    const resolved = resolve(cliOptions.config);
    if (existsSync(resolved)) {
      const config = fetchFile<Partial<ParsedOptions> | ParsedOptionsFunction>(resolved);
      configFile = typeof config === 'function' ? config(process.env.NODE_ENV as string) : config;
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
  setByPriority(configFile, 'silent', cliOptions.silent, defaultCliOptions.silent);
  setByPriority(configFile, 'ignoreResult', cliOptions.ignoreResult, defaultCliOptions.ignoreResult);
  setByPriority(configFile, 'debug', cliOptions.debug, defaultCliOptions.debug);
  setByPriority(configFile, 'extLogic', cliOptions.extLogic, defaultCliOptions.extLogic, toArray);
  setByPriority(configFile, 'extStyle', cliOptions.extStyle, defaultCliOptions.extStyle, toArray);
  setObjectByPriority(configFile, 'legacy', cliOptions.legacy, defaultCliOptions.legacy);
  setObjectByPriority(configFile, 'maps', cliOptions.maps, defaultCliOptions.maps);
  setObjectByPriority(configFile, 'componentsJson', cliOptions.componentsJson, defaultCliOptions.componentsJson);
  setObjectByPriority(configFile, 'alias', undefined, defaultConfigs.alias);
  setObjectByPriority(configFile, 'chunks', undefined, defaultConfigs.chunks);
  setObjectByPriority(configFile, 'style', undefined, defaultConfigs.style);
  setObjectByPriority(configFile, 'runtime', undefined, defaultConfigs.runtime);

  setObjectByPriority(configFile, 'serve', undefined, defaultConfigs.serve);
  if (!cliOptions.serve) {
    configFile.serve = undefined;
  }

  configFile.plugins = [
    ...(configFile.plugins || []),
    ...(configFile.silent ? defaultPlugins.filter((name) => name !== 'logger') : defaultPlugins).map((pluginName) => {
      const plugin = fetchFile<Function>(`${__dirname}/../../../plugins/${pluginName}`);
      const pluginConfig = (configFile as Record<string, object>)[
        kebabToCamel(pluginName) as keyof typeof configFile
      ];
      return plugin(pluginConfig !== undefined ? pluginConfig : {}) as Plugin;
    }),
  ];

  return configFile as ParsedOptions;
};
