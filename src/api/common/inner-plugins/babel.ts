import * as babelPresetEnv from '@babel/preset-env';
import * as babelPresetTypescript from '@babel/preset-typescript';
import * as babelPluginProposalClassProperties from '@babel/plugin-proposal-class-properties';
import * as babelPluginTransformClasses from '@babel/plugin-transform-classes';
import * as babelPluginTransformObjectAssign from '@babel/plugin-transform-object-assign';
import { ParsedOptions } from '../types';

export const getBabelConfig = (config: ParsedOptions): object => ({
  babelrc: false,
  extensions: config.extLogic,
  presets: [
    babelPresetEnv,
    babelPresetTypescript,
  ],
  plugins: [
    [babelPluginProposalClassProperties, { loose: true }],
    [babelPluginTransformClasses, { loose: true }],
    babelPluginTransformObjectAssign,
  ],
});
