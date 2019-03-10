import { NodeEnvironment } from './types';
export declare const getRuntime: (runtime: IndexObjectAny, environment: NodeEnvironment, paths: {
    app: string;
    assetsRelative: string;
    bundlesRelative: string;
    dist: string;
    buildRelative: string;
    server: string;
    baseAbsolute: string;
    appAbsolute: string;
    bundlesAbsolute: string;
    assetsAbsolute: string;
    buildAbsolute: string;
    distAbsolute: string;
}) => IndexObjectAny;
