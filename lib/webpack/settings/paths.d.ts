export declare const getPaths: (paths?: {
    app?: string | undefined;
    pagesRelative?: string | undefined;
    assetsRelative?: string | undefined;
    dist?: string | undefined;
    buildRelative?: string | undefined;
    serverPrefixRuntimeKey?: string | undefined;
} | undefined) => {
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
};
