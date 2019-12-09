import { Options, ParsedOptions, PluginRow, PluginEvent, PluginRowSimple } from './types';
export declare const toThenable: (object: void | Promise<void>) => Promise<void>;
export declare const parseOptions: (cliOptions: Partial<Options>) => ParsedOptions;
export declare const getPlugins: (plugins: PluginRow[], name: PluginEvent) => PluginRowSimple[];
