/// <reference types="node" />
import { OutputFile, ParsedOptions, PostBuild } from './types';
export declare const addOutputFile: (name: string, content: string | Buffer, files: Record<string, OutputFile>) => void;
export declare const removeOutputFile: (file: string, files: Record<string, OutputFile>) => void;
export declare const emit: (options: ParsedOptions, builds: PostBuild[]) => Promise<void>;
