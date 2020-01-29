"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const deepmerge = require("deepmerge");
const json_handlers_1 = require("../../../json-handlers");
const MINIMAL_TYPESCRIPT_CONFIG = {
    compilerOptions: {
        esModuleInterop: true,
    },
};
const MANDATORY_TYPESCRIPT_CONFIG = {
    compilerOptions: {
        target: 'ES6',
    },
};
const MANDATORY_TYPESCRIPT_CONFIG_DELETIONS = ['include', 'exclude'];
exports.typescript = () => {
    const configFile = path_1.resolve(`${process.cwd()}/tsconfig.json`);
    const tsconfig = configFile && fs_extra_1.existsSync(configFile)
        ? json_handlers_1.requireJson(configFile)
        : MINIMAL_TYPESCRIPT_CONFIG;
    MANDATORY_TYPESCRIPT_CONFIG_DELETIONS.forEach((key) => {
        tsconfig[key] = undefined;
    });
    return {
        typescript: require('typescript'),
        tsconfigOverride: deepmerge(tsconfig, MANDATORY_TYPESCRIPT_CONFIG),
    };
};
