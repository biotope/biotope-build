"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.react = function (settings) {
    settings.compilation.rules.forEach(function (rules) {
        var use = rules.use;
        if (use) {
            var loaders_1 = [];
            if (Array.isArray(use)) {
                use.forEach(function (loader) { return loaders_1.push(loader); });
            }
            else if (use.loader) {
                loaders_1.push(use);
            }
            loaders_1.forEach(function (loader) {
                if (loader.loader === 'babel-loader') {
                    loader.options.presets.push('@babel/react');
                }
            });
        }
    });
    return settings;
};
