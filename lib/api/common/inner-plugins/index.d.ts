import * as rawCommonjs from 'rollup-plugin-commonjs';
import * as rawNodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
export * from './babel';
export * from './commonjs';
export * from './copy';
export * from './node-resolver';
export * from './postcss';
export * from './typescript';
export declare const innerPlugins: {
    babel: any;
    commonjs: typeof rawCommonjs.default;
    copy: any;
    nodeResolve: typeof rawNodeResolve.default;
    postcss: any;
    terser: typeof terser;
    typescript: import("rollup").PluginImpl<import("rollup-plugin-typescript2/dist/partial").Partial<import("rollup-plugin-typescript2/dist/ioptions").IOptions>>;
};
export declare type InnerPlugin = keyof typeof innerPlugins;
