import { OutputFileInfo, LegacyOptions, StyleOptions } from '../../types';

export interface BundleExtractPluginOptions {
  isLegacyBuild: boolean;
  production: boolean;
  style: StyleOptions;
  legacy?: LegacyOptions;
  addFile: (file: OutputFileInfo, override?: boolean) => void;
}

export interface AddWatchPluginOptions {
  pointer: string;
  triggerBuild: () => void;
}
