"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeName = exports.requireJson = exports.parseJson = void 0;
const fs_extra_1 = require("fs-extra");
const commentJson = require("comment-json");
exports.parseJson = (content) => commentJson.parse(content);
exports.requireJson = (file) => exports.parseJson(fs_extra_1.readFileSync(file).toString());
exports.safeName = (name) => name
    .replace(/[&#,+()$~%.'":*?<>{}\s\-/@\\0-9]/g, '_')
    .toLowerCase();
