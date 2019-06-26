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
var babelOptions = require(project_paths_1.biotopeBuildPath + "/.babelrc.js");
var postCssPath = project_paths_1.biotopeBuildPath + "/postcss.config.js";
var getStyleNaming = function (minify, globalStyles, prefix) {
    if (globalStyles) {
        return prefix + "[name]";
    }
    return "" + prefix + (minify ? '[hash:base64:24]' : '[path][name]-[local]');
};
exports.getRules = function (minify, global, extract, prefix, compileExclusions, runtimeVariables) { return ([
    __assign({ test: /\.(j|t)s$/, use: {
            loader: 'babel-loader',
            options: babelOptions,
        } }, (compileExclusions.length
        ? { exclude: new RegExp("node_modules/(" + compileExclusions.join('|') + ")") }
        : {})),
    {
        test: /\.s?css$/,
        use: [
            {
                loader: path_1.resolve(project_paths_1.biotopeBuildPath + "/lib/webpack/settings/style-loader"),
            }
        ].concat((extract ? [mini_css_extract_plugin_1.loader] : []), [
            {
                loader: 'css-loader',
                options: {
                    camelCase: true,
                    modules: true,
                    url: function (url, resource) {
                        var resourceFolder = resource.split('/');
                        resourceFolder.pop();
                        return url.indexOf('http') === 0 || url.indexOf('/') === 0
                            || (!fs_1.existsSync(path_1.resolve(url)) && !fs_1.existsSync(path_1.resolve(resourceFolder.join('/') + "/" + url)));
                    },
                    localIdentName: getStyleNaming(minify, global, prefix),
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
        test: /\.svg$/,
        use: 'raw-loader',
    },
    {
        test: /\.(png|jpe?g|gif)$/,
        use: 'url-loader',
    },
    {
        test: /\.html$/,
        loader: 'html-loader'
    }
]); };
