import { Plugin } from 'rollup';
import { ExcludePluginOptions } from './types';
export declare const exclude: ({ isLegacyBuild, legacy }: ExcludePluginOptions) => Plugin;
