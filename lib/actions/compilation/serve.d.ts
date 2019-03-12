export interface ServeOptions {
    directory?: string;
    open?: boolean;
    port?: number;
    production?: boolean;
    spa?: boolean;
}
export declare const serve: (options: ServeOptions) => void;
