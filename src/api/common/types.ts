import {
  RollupOptions, Plugin as RollupPlugin, RollupWarning, SourceMap,
} from 'rollup';

export interface Options {
  config: string;
  project: string;
  output: string;
  copy: string;
  exclude: string;
  maps: boolean;
  watch: boolean;
  serve: boolean;
  legacy: boolean;
  chunks: boolean;
  production: boolean;
  silent: boolean;
  ignoreResult: boolean;
  debug: boolean;
  componentsJson: boolean | string;
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
  only: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RuntimeOptions = Record<string, any>;

export interface StyleOptions {
  extract: boolean;
  global: boolean;
  modules: boolean;
}

export interface MapOptions {
  type: 'file' | 'inline' | 'hidden';
  environment: 'all' | 'development' | 'production';
}

export interface ParsedOptionsConfig {
  componentsJson: false | string;
  maps: false | MapOptions;
  legacy: false | LegacyOptions;
  serve: false | ServeOptions;
  chunks: false | Record<string, string[]>;
  alias: Record<string, string>;
  style: StyleOptions;
  runtime: RuntimeOptions;
}

export interface CopyItem {
  from: string;
  to?: string;
  ignore?: string[];
}

export type PluginHook = 'before-build' | 'mid-build' | 'before-emit' | 'after-emit';

export interface Plugin {
  name?: string;
  hook?: PluginHook;
  priority?: number;
  runner: Function;
}

export interface ParsedOptions extends ParsedOptionsConfig {
  project: string;
  exclude: string[];
  output: string;
  copy: (string | CopyItem)[];
  watch: boolean;
  production: boolean;
  silent: boolean;
  ignoreResult: boolean;
  debug: boolean;
  extLogic: string[];
  extStyle: string[];
  plugins: Plugin[];
}

export type ParsedOptionsFunction = (environment: string) => Partial<ParsedOptions>;

export type RollupEventCode = 'START' | 'BUNDLE_START' | 'BUNDLE_END' | 'END' | 'ERROR';

export interface PreRollupOptions extends RollupOptions {
  priorityPlugins: RollupPlugin[];
  pluginsConfig: Record<string, object[] | undefined>;
}

export interface OutputFileInfo {
  name: string;
  content: string | Buffer;
  mapping?: SourceMap;
}

export interface OutputFile {
  name: string;
  content: string | Buffer;
  changed: boolean;
  checksum: string;
  size: number;
  gzip: number;
  buildId: string;
  previousChecksum: string;
}

export interface Build {
  build: PreRollupOptions;
  legacy: boolean;
  outputFiles: Record<string, OutputFile>;
  warnings: Record<string, RollupWarning[]>;
  addFile: (file: OutputFileInfo, override?: boolean) => void;
  removeFile: (file: OutputFileInfo) => void;
  triggerBuild: (file?: string) => void;
}

export interface PostBuild {
  build: RollupOptions;
  legacy: boolean;
  outputFiles: Record<string, OutputFile>;
  warnings: Record<string, RollupWarning[]>;
  addFile: (file: OutputFileInfo, override?: boolean) => void;
  removeFile: (file: OutputFileInfo) => void;
  triggerBuild: (file?: string) => void;
}
