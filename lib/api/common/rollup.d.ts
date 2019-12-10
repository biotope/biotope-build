import { RollupOptions } from 'rollup';
import { ParsedOptions, PreRollupOptions } from './types';
export declare const createPreBuilds: (config: ParsedOptions) => PreRollupOptions[];
export declare const finalizeBuilds: (builds: PreRollupOptions[]) => RollupOptions[];
