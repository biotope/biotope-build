"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleExtract = (config, isLegacyBuild, extracted, addFile) => ({
    isLegacyBuild,
    production: config.production,
    style: config.style,
    extracted,
    legacy: isLegacyBuild ? config.legacy : undefined,
    addFile,
});
