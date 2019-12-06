"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../../package.json");
exports.registerVersion = (program) => program.version(package_json_1.version);
