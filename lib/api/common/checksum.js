"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checksum = void 0;
const crc_1 = require("crc");
exports.checksum = (data) => crc_1.crc32(data.toString()).toString(16);
