import { RollupBuild, RollupOptions, RollupOutput } from 'rollup';
export declare type PluginEvent = 'before-build' | 'after-build';
export interface PluginRowBase extends Array<any> {
    0: PluginEvent;
    1: Function;
}
export interface PluginRowSimpleBefore extends PluginRowBase {
    0: 'before-build';
    1: (config: ParsedOptions, builds: RollupOptions[]) => void | Promise<void>;
}
export interface PluginRowSimpleAfter extends PluginRowBase {
    0: 'after-build';
    1: (data: RollupEvent | RollupOutput[]) => void | Promise<void>;
}
export declare type PluginRowSimple = PluginRowSimpleBefore | PluginRowSimpleAfter;
export declare type PluginRow = PluginRowSimple | PluginRowSimple[];
export declare type PluginRowMaker = (options: object) => PluginRow;
export interface Options {
    config: string;
    project: string;
    output: string;
    copy: string;
    exclude: string;
    watch: boolean;
    serve: boolean;
    legacy: boolean;
    chunks: boolean;
    production: boolean;
    extLogic: string;
    extStyle: string;
}
export interface ServeOptions {
    port: number;
    open: boolean;
    spa: boolean;
    secure: boolean;
}
export interface LegacyOptions {
    inline: boolean;
    suffix: string;
}
export interface ParsedOptionsConfig {
    legacy: false | LegacyOptions;
    serve: false | ServeOptions;
    chunks: false | Record<string, string[]>;
}
export interface ParsedOptions extends ParsedOptionsConfig {
    project: string;
    exclude: string[];
    output: string;
    copy: string[];
    watch: boolean;
    production: boolean;
    extLogic: string[];
    extStyle: string[];
    plugins: PluginRow[];
}
export interface RollupEventStart {
    code: 'START';
}
export interface RollupEventEnd {
    code: 'END';
}
export interface RollupEventError {
    code: 'ERROR';
    error: Error;
}
export interface RollupEventBundleStart {
    code: 'BUNDLE_START';
    input: Record<string, string>;
    output: string[];
}
export interface RollupEventBundleEnd {
    code: 'BUNDLE_END';
    input: Record<string, string>;
    output: string[];
    duration: number;
    result: RollupBuild;
}
export declare type RollupEvent = RollupEventStart | RollupEventEnd | RollupEventError | RollupEventBundleStart | RollupEventBundleEnd;
