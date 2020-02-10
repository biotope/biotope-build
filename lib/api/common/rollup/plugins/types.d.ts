import { OutputFileInfo } from '../../types';
export interface BundleExtractPluginOptions {
    legacy: boolean;
    isInline: boolean;
    styleExtracted: boolean;
    production: boolean;
    suffix: string;
    addFile: (file: OutputFileInfo, override?: boolean) => void;
}
export interface AddWatchPluginOptions {
    pointer: string;
    triggerBuild: () => void;
}
