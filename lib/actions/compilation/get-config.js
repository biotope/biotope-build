"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var CONFIG_DEFAULT = 'biotope-build.config.js';
exports.getConfig = function (config) {
    var configFile = process.cwd() + "/" + (config || CONFIG_DEFAULT);
    return fs_1.existsSync(configFile) ? require(configFile) : {};
};
