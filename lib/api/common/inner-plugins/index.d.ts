import * as commonjs from '@rollup/plugin-commonjs';
import * as nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
export * from './babel';
export * from './commonjs';
export * from './node-resolver';
export * from './postcss';
export * from './typescript';
export declare const innerPlugins: {
    babel: any;
    commonjs: typeof commonjs;
    nodeResolve: typeof nodeResolve;
    postcss: any;
    terser: typeof terser;
    typescript: import("rollup").PluginImpl<import("rollup-plugin-typescript2/dist/partial").Partial<import("rollup-plugin-typescript2/dist/ioptions").IOptions>>;
    json: () => import("rollup").Plugin;
};
export declare type InnerPlugin = keyof typeof innerPlugins;
