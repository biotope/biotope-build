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
var ExtendedDefinePlugin = require("extended-define-webpack-plugin");
var PrerenderSpaPlugin = require("prerender-spa-plugin");
var mergeDeep = require("merge-deep");
var base_config_1 = require("./base.config");
exports.config = function (options) {
    var _a = base_config_1.baseConfig(__assign({}, options, { minify: true })), configuration = _a[0], settings = _a[1];
    return settings.overrides(mergeDeep(configuration, {
        devtool: false,
        mode: 'production',
        optimization: {
            minimize: true,
            noEmitOnErrors: true,
        },
        plugins: base_config_1.ifPlugin(settings, 'extended-define-webpack-plugin', new ExtendedDefinePlugin(settings.runtime)).concat(base_config_1.ifPlugin(settings, 'prerender-spa-plugin', new PrerenderSpaPlugin(settings.webpack.rendering))),
    }));
};
