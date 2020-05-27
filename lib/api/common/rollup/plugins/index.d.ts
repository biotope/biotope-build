import * as commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
export declare const innerPlugins: {
    alias: any;
    babel: any;
    bundleExtract: ({ isLegacyBuild, production, style, extracted, legacy, addFile, }: import("./types").BundleExtractPluginOptions) => import("rollup").Plugin;
    commonjs: typeof commonjs;
    exclude: ({ isLegacyBuild, legacy }: import("./types").ExcludePluginOptions) => import("rollup").Plugin;
    json: () => import("rollup").Plugin;
    nodeResolve: typeof nodeResolve;
    postcss: any;
    replace: typeof replace;
    terser: typeof terser;
    typescript: import("rollup").PluginImpl<import("rollup-plugin-typescript2/dist/partial").Partial<import("rollup-plugin-typescript2/dist/ioptions").IOptions>>;
};
export declare type InnerPlugin = keyof typeof innerPlugins;
