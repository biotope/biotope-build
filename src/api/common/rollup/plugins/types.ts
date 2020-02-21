import { OutputFileInfo, LegacyOptions, StyleOptions } from '../../types';

export interface BundleExtractPluginOptions {
  isLegacyBuild: boolean;
  production: boolean;
  style: StyleOptions;
  extracted: Record<string, string>;
  legacy?: LegacyOptions;
  addFile: (file: OutputFileInfo, override?: boolean) => void;
}

export interface ExcludePluginOptions {
  isLegacyBuild: boolean;
  legacy: LegacyOptions;
}

export interface AddWatchPluginOptions {
  pointer: string;
  triggerBuild: () => void;
}
