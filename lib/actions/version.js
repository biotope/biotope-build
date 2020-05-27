"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVersion = void 0;
const json_handlers_1 = require("../api/common/json-handlers");
const { version } = json_handlers_1.requireJson(`${__dirname}/../../package.json`);
exports.registerVersion = (program) => program.version(version);
