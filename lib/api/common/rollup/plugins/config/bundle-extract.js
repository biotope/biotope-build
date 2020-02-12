"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleExtract = (config, isLegacyBuild, addFile) => ({
    isLegacyBuild,
    production: config.production,
    style: config.style,
    legacy: isLegacyBuild ? config.legacy : undefined,
    addFile,
});
