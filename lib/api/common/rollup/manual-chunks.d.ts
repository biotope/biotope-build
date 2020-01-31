import { ManualChunksOption } from 'rollup';
import { LegacyOptions } from '../types';
export declare const manualChunks: (folder: string, chunks: Record<string, string[]>, legacy: false | LegacyOptions) => ManualChunksOption;
