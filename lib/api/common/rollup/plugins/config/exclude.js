"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude = void 0;
exports.exclude = (config, legacy) => ({
    isLegacyBuild: legacy,
    legacy: config.legacy,
});
