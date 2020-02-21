import { Plugin } from 'rollup';
import { BundleExtractPluginOptions } from './types';
export declare const bundleExtract: ({ isLegacyBuild, production, style, extracted, legacy, addFile, }: BundleExtractPluginOptions) => Plugin;
