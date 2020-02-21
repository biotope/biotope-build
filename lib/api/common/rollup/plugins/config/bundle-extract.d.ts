import { ParsedOptions } from '../../../types';
import { BundleExtractPluginOptions } from '../types';
export declare const bundleExtract: (config: ParsedOptions, isLegacyBuild: boolean, extracted: Record<string, string>, addFile: (file: import("../../../types").OutputFileInfo, override?: boolean | undefined) => void) => BundleExtractPluginOptions;
