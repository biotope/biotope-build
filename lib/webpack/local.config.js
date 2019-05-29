"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExtendedDefinePlugin = require("extended-define-webpack-plugin");
var LiveReloadPlugin = require("webpack-livereload-plugin");
var mergeDeep = require("merge-deep");
var find_ports_1 = require("../find-ports");
var base_config_1 = require("./base.config");
exports.config = function (options) {
    var _a = base_config_1.baseConfig(options), configuration = _a[0], settings = _a[1];
    return settings.overrides(mergeDeep(configuration, {
        plugins: [
            new ExtendedDefinePlugin(settings.runtime),
            new LiveReloadPlugin({
                appendScriptTag: true,
                port: find_ports_1.findPort(35729) || 35729,
            }),
        ],
    }), 'local');
};
