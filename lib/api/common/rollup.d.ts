import { ParsedOptions, Build, PostBuild } from './types';
export declare const createPreBuilds: (config: ParsedOptions) => Build[];
export declare const finalizeBuilds: (builds: Build[]) => PostBuild[];
