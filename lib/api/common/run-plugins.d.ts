import { Plugin, PluginHook } from './types';
export declare const runPlugins: (plugins: Plugin[], hook: PluginHook, ...args: any[]) => Promise<void>;
