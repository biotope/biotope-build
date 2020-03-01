"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babelPresetEnv = require("@babel/preset-env");
const babelPresetTypescript = require("@babel/preset-typescript");
const babelPluginProposalClassProperties = require("@babel/plugin-proposal-class-properties");
const babelPluginTransformClasses = require("@babel/plugin-transform-classes");
const babelPluginTransformObjectAssign = require("@babel/plugin-transform-object-assign");
const babelPluginProposalDecorators = require("@babel/plugin-proposal-decorators");
const babelPluginTransformRuntime = require("@babel/plugin-transform-runtime");
const babelPluginModuleResolver = require("babel-plugin-module-resolver");
exports.babel = (config) => ({
    babelrc: false,
    extensions: config.extLogic,
    presets: [
        [babelPresetEnv],
        [babelPresetTypescript, { isTsx: true }],
    ],
    plugins: [
        [babelPluginProposalDecorators, { legacy: true }],
        [babelPluginProposalClassProperties, { loose: true }],
        [babelPluginTransformClasses],
        [babelPluginTransformObjectAssign],
        [babelPluginTransformRuntime],
        [babelPluginModuleResolver, {
                alias: config.alias,
                extensions: config.extLogic,
            }],
    ],
    runtimeHelpers: true,
    compact: false,
});
