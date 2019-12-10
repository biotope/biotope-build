import * as babel from 'rollup-plugin-babel';
import * as rawCommonjs from 'rollup-plugin-commonjs';
import * as copy from 'rollup-plugin-copy-glob';
import * as rawNodeResolve from 'rollup-plugin-node-resolve';
import * as postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import * as rawTypescript from 'rollup-plugin-typescript2';

// FIXME: typings fix for all these packages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commonjs: typeof rawCommonjs.default = rawCommonjs as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeResolve: typeof rawNodeResolve.default = rawNodeResolve as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typescript: typeof rawTypescript.default = rawTypescript as any;

export * from './babel';
export * from './commonjs';
export * from './copy';
export * from './node-resolver';
export * from './postcss';
export * from './typescript';

export const innerPlugins = {
  babel,
  commonjs,
  copy,
  nodeResolve,
  postcss,
  terser,
  typescript,
};

export type InnerPlugin = keyof typeof innerPlugins;
