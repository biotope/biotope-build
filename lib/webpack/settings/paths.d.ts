export declare const getPaths: (paths?: {
    app?: string | undefined;
    bundlesRelative?: string | undefined;
    assetsRelative?: string | undefined;
    dist?: string | undefined;
    buildRelative?: string | undefined;
    serverPrefixRuntimeKey?: string | undefined;
} | undefined) => {
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
};
