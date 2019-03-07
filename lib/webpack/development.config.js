"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExtendedDefinePlugin = require("extended-define-webpack-plugin");
var mergeDeep = require("merge-deep");
var base_config_1 = require("./base.config");
exports.config = function (options) {
    var _a = base_config_1.baseConfig(options), configuration = _a[0], settings = _a[1];
    return settings.overrides(mergeDeep(configuration, {
        plugins: [
            new ExtendedDefinePlugin(settings.runtime),
        ],
    }));
};
