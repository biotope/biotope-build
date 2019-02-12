export interface ServeOptions {
    directory?: string;
    open?: boolean;
    production?: boolean;
    spa?: boolean;
}
export declare const serve: (options: ServeOptions) => void;
