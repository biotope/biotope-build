import { ManualChunksOption } from 'rollup';
import { LegacyOptions } from '../types';
export declare const invertObject: (vendors: Record<string, string[]>) => Record<string, string>;
export declare const manualChunks: (folder: string, chunks: Record<string, string[]>, legacy: false | LegacyOptions) => ManualChunksOption;
