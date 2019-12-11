"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = require("postcss");
const autoprefixer = require("autoprefixer");
const path_1 = require("path");
const createExtractor = (localCSS = {}) => ({
    getJSON: (filename, json) => {
        if (localCSS[filename]) {
            Object.keys(json).filter((key) => json[key][0] !== '#').forEach((key) => {
                localCSS[filename] = localCSS[filename].replace(new RegExp(`.${key}`, 'g'), `.${json[key]}`);
            });
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
        generateScopedName(name, file, css) {
            const isClass = css.indexOf(`.${name}`) >= 0;
            const path = file
                .replace(`${path_1.resolve(`${process.cwd()}/${config.project}`)}/`, '')
                .replace(/[&#,+()$~%.'":*?<>{}\s-]/g, '-')
                .replace(/[/\\]/g, '_');
            return isClass ? `${path}_${name}` : `#${name}`;
        },
        getJSON: extractor.getJSON,
    },
    plugins: [
        autoprefixer({ grid: 'autoplace' }),
        extractor.plugin,
    ],
});
