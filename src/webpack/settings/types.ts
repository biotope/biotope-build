import { Configuration, Rule, Options as WebpackOptions } from 'webpack';

export type ProjectEnvironment = 'local' | 'dev' | 'prod';
export type NodeEnvironment = 'local' | 'development' | 'production' | 'test';

// Copied and adapted from "@types/copy-webpack-plugin"
// "@types/node" is added to the dependencies list as the type "Buffer" is used by the plugin
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
  cache?: boolean | { key: string };
  transformPath?: (targetPath: string, absolutePath: string) => string | Promise<string>;
}

export type OverrideFunction = (
  configuration: Configuration,
  environment: ProjectEnvironment,
) => Configuration;

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

export type WebpackConfig = (options: Options) => Configuration;
