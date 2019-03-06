"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExtendedDefinePlugin = require("extended-define-webpack-plugin");
var LiveReloadPlugin = require("webpack-livereload-plugin");
var mergeDeep = require("merge-deep");
var base_config_1 = require("./base.config");
exports.config = function (options) {
    var _a = base_config_1.baseConfig(options), configuration = _a[0], settings = _a[1];
    return settings.overrides(mergeDeep(configuration, {
        plugins: (!settings.compilation.enablePlugins.indexOf('extended-define-webpack-plugin') ? [] : [
            new ExtendedDefinePlugin(settings.runtime),
        ]).concat((!settings.compilation.enablePlugins.indexOf('webpack-livereload-plugin') ? [] : [
            new LiveReloadPlugin({
                appendScriptTag: true,
            }),
        ])),
    }));
};
