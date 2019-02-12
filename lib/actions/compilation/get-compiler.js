"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack = require("webpack");
var webpack_1 = require("../../webpack");
var get_config_1 = require("./get-config");
exports.getCompiler = function (_a) {
    var config = _a.config, environment = _a.environment;
    var nodeEnvironment = webpack_1.environments[environment || 'default'];
    var compiler = webpack(webpack_1.webpackInit(nodeEnvironment, get_config_1.getConfig(config)));
    (new webpack.ProgressPlugin()).apply(compiler);
    return compiler;
};
