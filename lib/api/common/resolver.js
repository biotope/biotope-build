"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolver = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const glob_1 = require("glob");
exports.resolver = (pattern, includeNodeModules, extensions) => (Array.isArray(pattern) ? pattern : [pattern])
    .map((item) => (item.indexOf('*') < 0 && fs_extra_1.existsSync(item) && fs_extra_1.statSync(item).isDirectory() ? `${item}/**/*` : item))
    .map((item) => glob_1.sync(item))
    .reduce((accumulator, file) => ([
    ...accumulator,
    ...file,
]), [])
    .filter((file) => (!includeNodeModules ? file.indexOf('node_modules') < 0 : true))
    .filter((item) => (extensions
    ? extensions.reduce((hasExt, ext) => (new RegExp(`\\${ext}$`)).test(item) || hasExt, false)
    : true))
    .map((item) => path_1.resolve(item))
    .filter((item) => !fs_extra_1.statSync(item).isDirectory());
