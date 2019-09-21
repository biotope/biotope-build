import { Transform } from "stream";

export interface ServeConfig {
  port: number;
  layoutFile: string;
}

export type BundleConfig = IndexObject<string> | string[];

export type VendorConfig = IndexObject<string[]> | string[];

export interface PathsConfig {
  distFolder: string;
  vendorFolder: string;
}

export interface CopyConfig {
  src: string;
  transform: (filepath: string) => Transform;
}

export interface BuildConfig {
  bundles: BundleConfig;
  vendorChunks: VendorConfig;
  paths: Partial<PathsConfig>;
  extensions: string[];
  serve: Partial<ServeConfig>;
  legacy: boolean;
  copyFiles: CopyConfig[];
  plugins: BuildTask[];
}

export type BuildTask = (config: BuildConfig, isServing: boolean) => Promise<void>;
