"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleExtract = (config, isLegacyBuild, addFile) => ({
    legacy: isLegacyBuild,
    isInline: isLegacyBuild ? config.legacy.inline : false,
    styleExtracted: config.style.extract,
    production: config.production,
    addFile,
});