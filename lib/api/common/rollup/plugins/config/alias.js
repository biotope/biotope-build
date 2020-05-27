"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alias = void 0;
exports.alias = (config) => ({
    entries: Object.keys(config.alias).map((key) => ({
        find: key,
        replacement: config.alias[key],
    })),
});
