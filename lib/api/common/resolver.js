"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const glob_1 = require("glob");
exports.resolver = (pattern, includeNodeModules, extensions) => pattern
    .map((item) => (item.indexOf('*') < 0 && fs_1.statSync(item).isDirectory() ? `${item}/**/*` : item))
    .map((item) => glob_1.sync(item))
    .reduce((accumulator, file) => ([
    ...accumulator,
    ...file,
]), [])
    .filter((file) => (!includeNodeModules ? file.indexOf('node_modules') < 0 : true))
    .filter((item) => (extensions
    ? extensions.reduce((hasExt, ext) => (new RegExp(`\\${ext}$`)).test(item) || hasExt, false)
    : true))
    .map((item) => path_1.resolve(item));
