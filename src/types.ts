
export interface ServeConfig {
  port: number;
  layoutFile: string;
}

export type BundleConfig = IndexObject<string> | string[];

export interface PathsConfig {
  distFolder: string;
  vendorFolder: string;
}

export interface BuildConfig {
  bundles: BundleConfig;
  vendorChunks: string[];
  paths: Partial<PathsConfig>;
  extensions: string[];
  serve: Partial<ServeConfig>;
  legacy: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GulpPipeReturn = any;

export type GulpTaskPromise = () => Promise<void>;

export type GulpTaskCallback = (resolve: Function) => void;

export type GulpTask = GulpTaskPromise | GulpTaskCallback;

export type GulpTaskCreator = (config: BuildConfig) => GulpTask;
