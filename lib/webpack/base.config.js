"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var settings_1 = require("./settings");
exports.baseConfig = function (options) {
    var settings = settings_1.getSettings(options);
    return [{
            context: settings.paths.appAbsolute,
            devtool: 'cheap-module-source-map',
            mode: 'development',
            entry: Object.keys(settings.compilation.entryPoints).reduce(function (accumulator, key) {
                var _a;
                return (__assign({}, accumulator, (_a = {}, _a[key] = settings.paths.bundlesAbsolute + "/" + settings.compilation.entryPoints[key].file, _a)));
            }, {}),
            module: { rules: settings.compilation.rules },
            output: {
                path: settings.paths.buildAbsolute,
                filename: settings.compilation.output.script,
                publicPath: "" + settings.paths.server + settings.paths.buildRelative,
            },
            optimization: {
                minimize: false,
                splitChunks: {
                    cacheGroups: settings.compilation.chunks.reduce(function (accumulator, value) {
                        var _a;
                        return (__assign({}, accumulator, (_a = {}, _a[value.name] = value, _a)));
                    }, {}),
                },
            },
            plugins: [
                new clean_webpack_plugin_1.default({
                    cleanOnceBeforeBuildPatterns: [settings.paths.distAbsolute + "/*"].concat((settings.compilation.cleanExclusions || [])
                        .map(function (exclusion) { return "!" + settings.paths.distAbsolute + "/" + exclusion; })),
                }),
                new CopyWebpackPlugin(settings.compilation.externalFiles.map(function (filesRules) {
                    var parsedRules = typeof filesRules === 'string' ? { from: filesRules } : filesRules;
                    return __assign({}, parsedRules, { to: settings.paths.distAbsolute + "/" + (parsedRules.to || ''), ignore: parsedRules.ignore || ['.*'] });
                }))
            ].concat((!settings.compilation.extractStyle ? [] : [
                new MiniCssExtractPlugin({
                    filename: settings.compilation.output.style,
                }),
            ])),
            resolve: {
                extensions: settings.compilation.extensions,
                alias: settings.compilation.alias,
                modules: [
                    settings.paths.appAbsolute,
                    'node_modules',
                ],
            },
        }, settings];
};
