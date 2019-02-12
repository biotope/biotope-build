import { Stats } from 'webpack';
interface WebpackCompileError extends Error {
    details?: any;
}
declare type CompilerCallback = (error: WebpackCompileError, stats: Stats) => void;
export declare const compilerCallback: (watch?: boolean, spa?: boolean) => CompilerCallback;
export {};
