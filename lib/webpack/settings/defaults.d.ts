export declare const defaultOptions: {
    compilation: {
        extensions: string[];
        externalFiles: {
            from: string;
            to: string;
            ignore: string[];
        }[];
        chunks: {
            test: RegExp;
            name: string;
            enforce: boolean;
            priority: number;
            chunks: "async" | "all" | "initial";
            minChunks: number;
        }[];
    };
};
