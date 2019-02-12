"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = require("../../package.json");
exports.registerVersion = function (program) { return program.version(package_json_1.version); };
