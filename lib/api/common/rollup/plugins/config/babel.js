"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babelPresetEnv = require("@babel/preset-env");
const babelPresetTypescript = require("@babel/preset-typescript");
const babelPluginProposalClassProperties = require("@babel/plugin-proposal-class-properties");
const babelPluginTransformClasses = require("@babel/plugin-transform-classes");
const babelPluginTransformObjectAssign = require("@babel/plugin-transform-object-assign");
const babelPluginProposalDecorators = require("@babel/plugin-proposal-decorators");
const babelPluginTransformRuntime = require("@babel/plugin-transform-runtime");
exports.babel = (config) => ({
    babelrc: false,
    extensions: config.extLogic,
    presets: [
        babelPresetEnv,
        babelPresetTypescript,
    ],
    plugins: [
        [babelPluginProposalDecorators, { legacy: true }],
        [babelPluginProposalClassProperties, { loose: true }],
        [babelPluginTransformClasses, { loose: true }],
        babelPluginTransformObjectAssign,
        babelPluginTransformRuntime,
    ],
    runtimeHelpers: true,
    compact: false,
});
