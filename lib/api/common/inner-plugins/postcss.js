"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = require("postcss");
const autoprefixer = require("autoprefixer");
const createExtractor = (localCSS = {}) => ({
    getJSON: (filename, json) => {
        if (localCSS[filename]) {
            json.default = localCSS[filename];
        }
    },
    plugin: postcss_1.plugin('postcss-custom-content-extractor', () => (root) => {
        const result = root.toResult().css;
        if (root.source && root.source.input.file && result.indexOf(':export') === -1) {
            localCSS[root.source.input.file] = result;
        }
    })(),
});
exports.getPostcssConfig = (config, extractor = createExtractor()) => ({
    extensions: config.extStyle,
    inject: false,
    minimize: config.production,
    modules: {
        camelCase: true,
        generateScopedName: '[path]__[name]__[local]--[hash:base64:5]',
        getJSON: extractor.getJSON,
    },
    plugins: [
        autoprefixer({ grid: 'autoplace' }),
        extractor.plugin,
    ],
});
