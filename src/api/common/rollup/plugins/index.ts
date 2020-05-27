import * as alias from '@rollup/plugin-alias';
import * as commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as replace from '@rollup/plugin-replace';
import * as babel from 'rollup-plugin-babel';
import * as postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import * as rawTypescript from 'rollup-plugin-typescript2';
import { json } from './json';
import { exclude } from './exclude';
import { bundleExtract } from './bundle-extract';

// FIXME: typings fix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typescript: typeof rawTypescript.default = rawTypescript as any;

export const innerPlugins = {
  alias,
  babel,
  bundleExtract,
  commonjs,
  exclude,
  json,
  nodeResolve,
  postcss,
  replace,
  terser,
  typescript,
};

export type InnerPlugin = keyof typeof innerPlugins;
