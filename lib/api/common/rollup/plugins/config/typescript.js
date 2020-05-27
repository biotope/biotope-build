"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typescript = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const deepmerge = require("deepmerge");
const json_handlers_1 = require("../../../json-handlers");
const MINIMAL_CONFIG_PATH = path_1.resolve(`${__dirname}/../../../../../../tsconfig.minimal.json`);
const MINIMAL_CONFIG_CONTENT = json_handlers_1.requireJson(MINIMAL_CONFIG_PATH);
const BUILD_CONFIG_CONTENT = {
    compilerOptions: {
        allowJs: true,
        allowUnreachableCode: true,
        noEmitOnError: false,
    },
};
exports.typescript = () => {
    const configFile = path_1.resolve(`${process.cwd()}/tsconfig.json`);
    const configFileExists = configFile && fs_extra_1.existsSync(configFile);
    const tsconfig = configFileExists ? json_handlers_1.requireJson(configFile) : MINIMAL_CONFIG_CONTENT;
    return {
        typescript: require('typescript'),
        tsconfig: !configFileExists ? MINIMAL_CONFIG_PATH : configFile,
        tsconfigOverride: deepmerge(deepmerge(MINIMAL_CONFIG_CONTENT, tsconfig), BUILD_CONFIG_CONTENT),
    };
};
