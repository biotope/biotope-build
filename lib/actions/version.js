"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const require_json_js_1 = require("../api/common/require-json.js");
const { version } = require_json_js_1.requireJson('../../package.json');
exports.registerVersion = (program) => program.version(version);
