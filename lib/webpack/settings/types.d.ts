/// <reference types="node" />
import { Configuration, Rule, Options as WebpackOptions } from 'webpack';
export declare type ProjectEnvironment = 'local' | 'dev' | 'prod';
export declare type NodeEnvironment = 'local' | 'development' | 'production' | 'test';
export interface ExternalFile {
    from: string;
    to?: string;
    context?: string;
    toType?: 'file' | 'dir' | 'template';
    test?: RegExp;
    force?: boolean;
    ignore?: string[];
    flatten?: boolean;
    transform?: (content: Buffer, path: string) => string | Buffer | Promise<string | Buffer>;
    cache?: boolean | {
        key: string;
    };
    transformPath?: (targetPath: string, absolutePath: string) => string | Promise<string>;
}
export declare type OverrideFunction = (configuration: Configuration, environment: ProjectEnvironment) => Configuration;
export interface EntryPoint {
    file: string;
}
export interface StyleOptions {
    global?: boolean;
    extract?: boolean;
    prefix?: string;
}
export interface Options {
    compilation?: {
        alias?: IndexObject<string>;
        chunks?: WebpackOptions.CacheGroupsOptions[];
        cleanExclusions?: string[];
        compileExclusions?: string[];
        entryPoints?: string[];
        extensions?: string[];
        externalFiles?: (string | ExternalFile)[];
        htmlTemplate?: string;
        style?: StyleOptions;
        output?: {
            script?: string;
            style?: string;
        };
        rules?: Rule[];
    };
    environment?: NodeEnvironment;
    minify?: boolean;
    overrides?: OverrideFunction;
    paths?: {
        app?: string;
        bundlesRelative?: string;
        assetsRelative?: string;
        dist?: string;
        buildRelative?: string;
        serverPrefixRuntimeKey?: string;
    };
    runtime?: IndexObjectAny;
}
export interface Settings {
    compilation: {
        alias: IndexObject<string>;
        chunks: WebpackOptions.CacheGroupsOptions[];
        cleanExclusions: string[];
        entryPoints: IndexObject<EntryPoint>;
        extensions: string[];
        externalFiles: (string | ExternalFile)[];
        extractStyle: boolean;
        htmlTemplate: string;
        output: {
            script: string;
            style: string;
        };
        rules: Rule[];
    };
    environment: NodeEnvironment;
    minify: boolean;
    overrides: OverrideFunction;
    paths: {
        app: string;
        assetsRelative: string;
        bundlesRelative: string;
        dist: string;
        buildRelative: string;
        server: string;
        baseAbsolute: string;
        appAbsolute: string;
        bundlesAbsolute: string;
        assetsAbsolute: string;
        buildAbsolute: string;
        distAbsolute: string;
    };
    runtime: IndexObjectAny;
}
export declare type WebpackConfig = (options: Options) => Configuration;
