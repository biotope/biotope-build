"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
exports.projectPath = path_1.resolve(process.cwd());
exports.biotopeBuildPath = path_1.resolve(__dirname + "/../../..");
exports.biotopeLibPath = path_1.resolve(exports.biotopeBuildPath + "/lib");
