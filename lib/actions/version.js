"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_handlers_1 = require("../api/common/json-handlers");
const { version } = json_handlers_1.requireJson('../../package.json');
exports.registerVersion = (program) => program.version(version);
