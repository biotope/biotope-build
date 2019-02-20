"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var tsConfig = require("../tsconfig.json");
var compile_1 = require("./compile");
var CONFIG_DEFAULT = './biotope-build.js';
var CONFIG_DEFAULT_TS = CONFIG_DEFAULT.replace('.js', '.ts');
var resolveConfigFile = function (configFile) {
    if (configFile) {
        if (fs_1.existsSync(path_1.resolve(configFile))) {
            return path_1.resolve(configFile);
        }
        throw new Error("Cannot find configuration file: \"" + configFile + "\"");
    }
    if (fs_1.existsSync(path_1.resolve(CONFIG_DEFAULT_TS))) {
        return path_1.resolve(CONFIG_DEFAULT_TS);
    }
    if (fs_1.existsSync(path_1.resolve(CONFIG_DEFAULT))) {
        return path_1.resolve(CONFIG_DEFAULT);
    }
    return '';
};
var isTsFile = function (file) { return file.split('.').pop() === 'ts'; };
exports.getConfigFile = function (configFile) {
    var actualConfigFile = resolveConfigFile(configFile);
    if (isTsFile(actualConfigFile)) {
        compile_1.compile([actualConfigFile], tsConfig);
        actualConfigFile = actualConfigFile.replace('.ts', '.js');
    }
    return actualConfigFile;
};
