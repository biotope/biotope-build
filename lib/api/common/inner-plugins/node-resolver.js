"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeResolverConfig = (config) => ({
    browser: true,
    extensions: config.extLogic,
});
