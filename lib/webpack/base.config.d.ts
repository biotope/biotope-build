import { Configuration, Plugin } from 'webpack';
import { Options, Settings } from './settings';
export declare const ifPlugin: (settings: Settings, plugin: string, value: Plugin) => Plugin[];
export declare const baseConfig: (options: Options) => [Configuration, Settings];
