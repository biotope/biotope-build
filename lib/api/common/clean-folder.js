"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rimraf = require("rimraf");
exports.cleanFolder = (folder) => rimraf.sync(folder);
