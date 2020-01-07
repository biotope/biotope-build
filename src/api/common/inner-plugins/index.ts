import * as babel from 'rollup-plugin-babel';
import * as commonjs from '@rollup/plugin-commonjs';
import * as nodeResolve from '@rollup/plugin-node-resolve';
import * as json from '@rollup/plugin-json';
import * as postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import * as rawTypescript from 'rollup-plugin-typescript2';

// FIXME: typings fix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typescript: typeof rawTypescript.default = rawTypescript as any;

export * from './babel';
export * from './commonjs';
export * from './node-resolver';
export * from './postcss';
export * from './typescript';

export const innerPlugins = {
  babel,
  commonjs,
  nodeResolve,
  postcss,
  terser,
  typescript,
  json,
};

export type InnerPlugin = keyof typeof innerPlugins;
