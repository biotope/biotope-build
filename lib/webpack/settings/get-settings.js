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
var path_1 = require("path");
var mergeDeep = require("merge-deep");
var environments_1 = require("./environments");
var paths_1 = require("./paths");
var rules_1 = require("./rules");
var runtime_1 = require("./runtime");
var entry_points_1 = require("./entry-points");
var defaultKeywords = ['biotope', 'boilerplate', 'modern', 'framework', 'html5'];
exports.getSettings = function (options) {
    var environment = options.environment || environments_1.environments.default;
    var minify = environment === 'local' ? !!options.minify : true;
    var paths = paths_1.getPaths(options.paths);
    var runtime = runtime_1.getRuntime(options.runtime || {}, environment, paths);
    var serverRuntimeKey = (options.paths || {}).serverPrefixRuntimeKey;
    paths.server = serverRuntimeKey ? runtime[serverRuntimeKey] : paths.server;
    var app = options.app || {};
    var compilation = options.compilation || {};
    var entryPoints = compilation.entryPoints || {
        index: 'index.ts',
    };
    var settings = {
        app: __assign({ title: 'Biotope Boilerplate v7', description: 'Modern HTML5 UI Framework', author: 'Biotope' }, app, { keywords: (app.keywords || defaultKeywords).join(',') }),
        environment: environment,
        minify: minify,
        overrides: options.overrides || (function (s) { return s; }),
        paths: paths,
        runtime: runtime,
        compilation: {
            alias: compilation.alias || {},
            chunks: compilation.chunks || [
                {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                },
                {
                    name: 'common',
                    chunks: 'initial',
                    minChunks: 2,
                },
            ],
            cleanExclusions: compilation.cleanExclusions || [],
            enablePlugins: compilation.enablePlugins || [],
            entryPoints: Object.keys(entryPoints).reduce(function (accumulator, key) {
                var _a;
                return (__assign({}, accumulator, (_a = {}, _a[key] = entry_points_1.getEntryPoints(typeof entryPoints[key] === 'string'
                    ? { file: entryPoints[key] }
                    : entryPoints[key], paths), _a)));
            }, {}),
            extensions: compilation.extensions || ['.ts', '.js', '.scss'],
            externalFiles: (compilation.externalFiles || [{
                    from: paths.appAbsolute + "/resources",
                    to: 'resources',
                    ignore: ['*.md'],
                }]).map(function (files) { return (typeof files === 'string' ? path_1.resolve(files) : (__assign({}, files, { from: path_1.resolve(files.from) }))); }),
            output: mergeDeep({
                script: '[name].js',
                style: '[name].css',
            }, compilation.output || {}),
            rules: rules_1.getRules(minify, compilation.globalStyles || false, compilation.enablePlugins || [], compilation.compileExclusions || [], runtime),
        },
    };
    return settings;
};
