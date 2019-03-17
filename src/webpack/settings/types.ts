import { Configuration, Rule, Options as WebpackOptions } from 'webpack';

export type ProjectEnvironment = 'local' | 'dev' | 'prod';
export type NodeEnvironment = 'local' | 'development' | 'production' | 'test';

export interface ExternalFile {
  from: string;
  to?: string;
  toType?: 'file' | 'dir' | 'template';
  context?: string;
  flatten?: boolean;
  ignore?: string[];
  transform?: (content: string, path: string) => string;
  cache?: boolean | { key: string };
  force?: boolean;
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
