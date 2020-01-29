import { Plugin } from 'rollup';
import { OutputFile } from '../../types';
export interface BundleExtractPluginOptions {
    legacy: boolean;
    isInline: boolean;
    production: boolean;
    outputFiles: Record<string, OutputFile>;
}
export declare const bundleExtract: (options: BundleExtractPluginOptions) => Plugin;
