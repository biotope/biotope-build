"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanFolder = void 0;
const rimraf = require("rimraf");
exports.cleanFolder = (folder) => rimraf.sync(folder);
