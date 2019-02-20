"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack = require("webpack");
var webpack_1 = require("../../webpack");
exports.getCompiler = function (_a) {
    var config = _a.config, environment = _a.environment;
    var nodeEnvironment = webpack_1.environments[environment || 'default'];
    var compiler = webpack(webpack_1.webpackInit(nodeEnvironment, (config && require(config)) || {}));
    (new webpack.ProgressPlugin()).apply(compiler);
    return compiler;
};
