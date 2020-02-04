import * as babel from 'rollup-plugin-babel';
import * as commonjs from '@rollup/plugin-commonjs';
import * as nodeResolve from '@rollup/plugin-node-resolve';
import * as alias from '@rollup/plugin-alias';
import * as postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import * as rawTypescript from 'rollup-plugin-typescript2';
import { json } from './json';
import { bundleExtract } from './bundle-extract';

// FIXME: typings fix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typescript: typeof rawTypescript.default = rawTypescript as any;

export const innerPlugins = {
  alias,
  babel,
  commonjs,
  nodeResolve,
  postcss,
  terser,
  typescript,
  json,
  bundleExtract,
};

export type InnerPlugin = keyof typeof innerPlugins;
