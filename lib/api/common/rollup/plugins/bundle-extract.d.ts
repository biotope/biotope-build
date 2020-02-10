import { Plugin } from 'rollup';
import { BundleExtractPluginOptions } from './types';
export declare const bundleExtract: ({ legacy, isInline, production, styleExtracted, suffix, addFile, }: BundleExtractPluginOptions) => Plugin;
