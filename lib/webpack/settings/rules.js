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
var fs_1 = require("fs");
var path_1 = require("path");
var mini_css_extract_plugin_1 = require("mini-css-extract-plugin");
var project_paths_1 = require("./project-paths");
var javascript_to_sass_1 = require("./javascript-to-sass");
var babelPath = fs_1.existsSync(project_paths_1.projectPath + "/.babelrc.js")
    ? project_paths_1.projectPath + "/.babelrc.js"
    : project_paths_1.biotopeBuildPath + "/.babelrc.js";
var babelOptions = require(babelPath);
var postCssPath = fs_1.existsSync(project_paths_1.projectPath + "/postcss.config.js")
    ? project_paths_1.projectPath + "/"
    : project_paths_1.biotopeBuildPath + "/";
var getStyleNaming = function (minify, globalStyles) {
    if (globalStyles) {
        return '[name]';
    }
    return minify ? '[hash:base64:24]' : '[path][name]-[local]';
};
exports.getRules = function (minify, globalStyles, disabledPlugins, compileExclusions, runtimeVariables) { return ([
    __assign({ test: /\.(js|tsx?)$/, use: {
            loader: 'babel-loader',
            options: babelOptions,
        } }, (compileExclusions.length
        ? { exclude: new RegExp("node_modules/(" + compileExclusions.join('|') + ")") }
        : {})),
    {
        test: /\.scss$/,
        use: [
            {
                loader: path_1.resolve(project_paths_1.biotopeBuildPath + "/lib/webpack/settings/style-loader"),
            }
        ].concat((disabledPlugins.indexOf('mini-css-extract-plugin') < 0 ? [mini_css_extract_plugin_1.loader] : []), [
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: getStyleNaming(minify, globalStyles),
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    config: { path: postCssPath },
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    data: javascript_to_sass_1.javascriptToSass(runtimeVariables),
                },
            },
        ]),
    },
    {
        test: /\.svg/,
        use: 'raw-loader',
    },
]); };
