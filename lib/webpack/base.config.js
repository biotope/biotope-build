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
var CleanWebpackPlugin = require("clean-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var FaviconsWebpackPlugin = require("favicons-webpack-plugin");
var ManifestJsonWebpackPlugin = require("manifest-json-webpack-plugin");
var settings_1 = require("./settings");
exports.ifPlugin = function (settings, plugin, value) { return ((settings.webpack.disablePlugins.indexOf(plugin) < 0 ? [value] : []).slice()); };
exports.baseConfig = function (options) {
    var settings = settings_1.getSettings(options);
    return [{
            context: settings.paths.appAbsolute,
            devtool: 'cheap-module-source-map',
            mode: 'development',
            entry: Object.keys(settings.webpack.entryPoints).reduce(function (accumulator, key) {
                var _a;
                return (__assign({}, accumulator, (_a = {}, _a[key] = settings.paths.pagesAbsolute + "/" + settings.webpack.entryPoints[key].file, _a)));
            }, {}),
            module: { rules: settings.webpack.rules },
            output: {
                path: settings.paths.buildAbsolute,
                filename: settings.webpack.output.script,
                publicPath: "" + settings.paths.server + settings.paths.buildRelative,
            },
            optimization: {
                minimize: false,
                splitChunks: {
                    cacheGroups: settings.webpack.chunks.reduce(function (accumulator, value) {
                        var _a;
                        return (__assign({}, accumulator, (_a = {}, _a[value.name] = value, _a)));
                    }, {
                        default: false,
                        vendors: false,
                    }),
                },
            },
            plugins: exports.ifPlugin(settings, 'clean-webpack-plugin', new CleanWebpackPlugin(settings.paths.dist, {
                root: settings.paths.baseAbsolute,
                exclude: settings.webpack.cleanExclusions || [],
                verbose: false,
            })).concat(exports.ifPlugin(settings, 'copy-webpack-plugin', new CopyWebpackPlugin(settings.webpack
                .externalFiles.map(function (filesRules) {
                var parsedRules = typeof filesRules === 'string' ? { from: filesRules } : filesRules;
                return __assign({}, parsedRules, { to: settings.paths.distAbsolute + "/" + (parsedRules.to || ''), ignore: parsedRules.ignore || ['.*'] });
            }))), exports.ifPlugin(settings, 'mini-css-extract-plugin', new MiniCssExtractPlugin({
                filename: settings.webpack.output.style,
            })), (settings.webpack.disablePlugins.indexOf('html-webpack-plugin') < 0
                ? Object.keys(settings.webpack.entryPoints).map(function (entryPoint) { return new HtmlWebpackPlugin(__assign({}, settings.app, { chunks: [entryPoint].concat(settings.webpack.chunks.map(function (chunk) { return chunk.name; })), filename: settings.webpack.entryPoints[entryPoint].filename, template: settings.webpack.entryPoints[entryPoint].template })); }) : []), exports.ifPlugin(settings, 'favicons-webpack-plugin', new FaviconsWebpackPlugin({
                title: settings.app.title,
                logo: settings.webpack.favicons.file,
                prefix: settings.webpack.favicons.output + "/",
                persistentCache: settings.webpack.favicons.cache,
                icons: settings.webpack.favicons.icons,
            })), exports.ifPlugin(settings, 'manifest-json-webpack-plugin', new ManifestJsonWebpackPlugin({
                path: settings.paths.pagesRelative.split('/').filter(function (f) { return !!f; }).reduce(function () { return '../'; }, ''),
                pretty: settings.minify,
                name: settings.app.title,
                description: settings.app.description,
                lang: 'en',
                icons: settings.webpack.favicons.output,
            }))),
            resolve: {
                extensions: settings.webpack.extensions,
                alias: settings.webpack.alias,
                modules: [
                    settings.paths.appAbsolute,
                    'node_modules',
                ],
            },
        }, settings];
};
