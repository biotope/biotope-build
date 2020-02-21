import { ManualChunksOption } from 'rollup';
import { ParsedOptions } from '../types';
export declare const invertObject: (vendors: Record<string, string[]>) => Record<string, string>;
export declare const manualChunks: (folder: string, config: ParsedOptions, isLegacyBuild: boolean) => ManualChunksOption;
