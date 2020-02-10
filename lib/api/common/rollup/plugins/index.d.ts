import * as commonjs from '@rollup/plugin-commonjs';
import * as nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
export declare const innerPlugins: {
    alias: any;
    babel: any;
    commonjs: typeof commonjs;
    nodeResolve: typeof nodeResolve;
    postcss: any;
    terser: typeof terser;
    typescript: import("rollup").PluginImpl<import("rollup-plugin-typescript2/dist/partial").Partial<import("rollup-plugin-typescript2/dist/ioptions").IOptions>>;
    json: () => import("rollup").Plugin;
    bundleExtract: ({ legacy, isInline, production, styleExtracted, suffix, addFile, }: import("./types").BundleExtractPluginOptions) => import("rollup").Plugin;
};
export declare type InnerPlugin = keyof typeof innerPlugins;
