import { OutputFile, ParsedOptions, PostBuild, OutputFileInfo } from './types';
export declare const getAddFileFunction: (config: ParsedOptions, files: Record<string, OutputFile>) => ({ name, content, mapping }: OutputFileInfo, override?: boolean) => void;
export declare const getRemoveFileFunction: (files: Record<string, OutputFile>) => ({ name, mapping }: OutputFileInfo) => void;
export declare const emit: (options: ParsedOptions, builds: PostBuild[]) => Promise<void>;
