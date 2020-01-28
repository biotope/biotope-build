/// <reference types="node" />
import { RollupOptions, Plugin as RollupPlugin, RollupWarning } from 'rollup';
export declare type PluginHook = 'before-build' | 'mid-build' | 'before-emit' | 'after-emit';
export interface Plugin {
    name?: string;
    hook?: PluginHook;
    priority?: number;
    runner: Function;
}
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
    debug: boolean;
    componentsJson: string;
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
export declare type RuntimeOptions = Record<string, any>;
export interface StyleOptions {
    extract: boolean;
    global: boolean;
    modules: boolean;
}
export interface ParsedOptionsConfig {
    legacy: false | LegacyOptions;
    serve: false | ServeOptions;
    chunks: false | Record<string, string[]>;
    style: StyleOptions;
    runtime: RuntimeOptions;
}
export interface CopyItem {
    from: string;
    to?: string;
    ignore?: string[];
}
export interface ParsedOptions extends ParsedOptionsConfig {
    project: string;
    exclude: string[];
    output: string;
    copy: (string | CopyItem)[];
    watch: boolean;
    production: boolean;
    debug: boolean;
    componentsJson: string;
    extLogic: string[];
    extStyle: string[];
    plugins: Plugin[];
}
export declare type RollupEventCode = 'START' | 'END' | 'ERROR' | 'BUNDLE_START' | 'BUNDLE_END';
export interface PreRollupOptions extends RollupOptions {
    priorityPlugins: RollupPlugin[];
    pluginsConfig: Record<string, object[] | undefined>;
}
export interface OutputFile {
    name: string;
    content: string | Buffer;
    changed: boolean;
    checksum: string;
    size: number;
    gzip: number;
}
export interface Build {
    build: PreRollupOptions;
    outputFiles: Record<string, OutputFile>;
    warnings: Record<string, RollupWarning[]>;
}
export interface PostBuild {
    build: RollupOptions;
    outputFiles: Record<string, OutputFile>;
    warnings: Record<string, RollupWarning[]>;
}
