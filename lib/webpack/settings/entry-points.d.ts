import { EntryPointOption, EntryPoint } from './types';
export declare const getEntryPoints: (entryPoint: EntryPointOption, paths: {
    app: string;
    assetsRelative: string;
    pagesRelative: string;
    dist: string;
    buildRelative: string;
    server: string;
    baseAbsolute: string;
    appAbsolute: string;
    pagesAbsolute: string;
    assetsAbsolute: string;
    buildAbsolute: string;
    distAbsolute: string;
}) => EntryPoint;
