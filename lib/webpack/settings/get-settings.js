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
var core_bundle_name_1 = require("./core-bundle-name");
var defaults_1 = require("./defaults");
var popLast = function (array) { return array.reverse().splice(1).reverse(); };
exports.getSettings = function (options) {
    var environment = options.environment || environments_1.environments.default;
    var minify = environment === 'local' ? !!options.minify : true;
    var paths = paths_1.getPaths(options.paths);
    var runtime = runtime_1.getRuntime(options.runtime || {}, environment, paths);
    var serverRuntimeKey = (options.paths || {}).serverPrefixRuntimeKey;
    paths.server = serverRuntimeKey ? runtime[serverRuntimeKey] : paths.server;
    var compilation = options.compilation || {};
    var style = __assign({ global: false, extract: false }, (compilation.style || {}));
    var entryPoints = (compilation.entryPoints || ['index.ts'])
        .reduce(function (accumulator, file) {
        var _a;
        return (__assign({}, accumulator, (_a = {}, _a[popLast(file.split('.')).join('.')] = { file: file }, _a)));
    }, {});
    var settings = {
        environment: environment,
        minify: minify,
        overrides: options.overrides || (function (s) { return s; }),
        paths: paths,
        runtime: runtime,
        compilation: {
            alias: compilation.alias || {},
            chunks: [
                {
                    test: /node_modules/,
                    name: core_bundle_name_1.getCoreBundleName(),
                    enforce: true,
                    priority: 100,
                    chunks: 'all',
                    minChunks: 1,
                }
            ].concat((compilation.chunks || [])),
            cleanExclusions: compilation.cleanExclusions || [],
            entryPoints: entryPoints,
            extensions: compilation.extensions || defaults_1.defaultOptions.compilation.extensions,
            externalFiles: (compilation.externalFiles || [{
                    from: paths.appAbsolute + "/resources",
                    to: 'resources',
                    ignore: ['*.md'],
                }]).map(function (files) { return (typeof files === 'string' ? path_1.resolve(files) : (__assign({}, files, { from: path_1.resolve(files.from) }))); }),
            extractStyle: style.extract,
            output: mergeDeep({
                script: '[name].js',
                style: '[name].css',
            }, compilation.output || {}),
            rules: rules_1.getRules(minify, style.global, style.extract, compilation.compileExclusions || [], runtime),
        },
    };
    return settings;
};
