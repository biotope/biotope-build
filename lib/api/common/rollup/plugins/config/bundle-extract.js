"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleExtract = (config, isLegacyBuild, outputFiles) => ({
    legacy: isLegacyBuild,
    isInline: isLegacyBuild ? config.legacy.inline : false,
    production: config.production,
    outputFiles,
});
