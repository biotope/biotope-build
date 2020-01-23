"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crc_1 = require("crc");
exports.checksum = (data) => crc_1.crc32(data).toString(16);
