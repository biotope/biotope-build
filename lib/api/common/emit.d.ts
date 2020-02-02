import { OutputFile, ParsedOptions, PostBuild, OutputFileInfo } from './types';
export declare const getAddFileFunction: (config: ParsedOptions, files: Record<string, OutputFile>) => ({ name, content, mapping }: OutputFileInfo) => void;
export declare const getRemoveFileFunction: (files: Record<string, OutputFile>) => (file: string | OutputFileInfo) => void;
export declare const emit: (options: ParsedOptions, builds: PostBuild[]) => Promise<void>;
