"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const glob_1 = require("glob");
exports.resolver = (extensions, pattern) => pattern
    .map((item) => (item.indexOf('*') < 0 && fs_1.statSync(item).isDirectory() ? `${item}/**/*` : item))
    .map((item) => glob_1.sync(item))
    .reduce((accumulator, p) => ([
    ...accumulator,
    ...p,
]), [])
    .filter((p) => p.indexOf('node_modules') < 0)
    .filter((item) => extensions.reduce((hasExt, ext) => item.split(ext).pop() === '' || hasExt, false))
    .map((item) => path_1.resolve(item));
