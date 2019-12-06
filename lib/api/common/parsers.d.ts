import { Options, ParsedOptions, PluginRow, PluginEvent, PluginRowSimple } from './types';
export declare const parseOptions: (cliOptions: Partial<Options>) => ParsedOptions;
export declare const getPlugins: (plugins: PluginRow[], name: PluginEvent) => PluginRowSimple[];
