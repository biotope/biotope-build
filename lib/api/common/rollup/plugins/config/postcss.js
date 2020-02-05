"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const postcss_1 = require("postcss");
const autoprefixer = require("autoprefixer");
const createExtractor = (localCSS = {}, identifiers = []) => ({
    identifiers,
    getJSON: (filename, json) => {
        if (localCSS[filename]) {
            Object.keys(json).filter((key) => !identifiers.includes(json[key])).forEach((key) => {
                localCSS[filename] = localCSS[filename].replace(new RegExp(`\\.${key}`, 'g'), `.${json[key]}`);
            });
            json.default = localCSS[filename];
        }
    },
    plugin: postcss_1.plugin('biotope-build-postcss-plugin-content-extractor', () => (root) => {
        const result = root.toResult().css;
        if (root.source && root.source.input.file && result.indexOf(':export') === -1) {
            localCSS[root.source.input.file] = result;
        }
    })(),
});
exports.postcss = (config, legacy, extractor = createExtractor()) => ({
    extensions: config.extStyle,
    extract: !legacy && config.style.extract,
    inject: false,
    minimize: config.production,
    modules: config.style.modules ? {
        camelCase: true,
        generateScopedName(name, file, css) {
            if (config.style.global) {
                return name;
            }
            if (css.indexOf(`.${name}`) < 0) {
                extractor.identifiers.push(name);
                return name;
            }
            const path = file
                .replace(`${path_1.resolve(`${process.cwd()}/${config.project}`)}/`, '')
                .replace(/[&#,+()$~%.'":*?<>{}\s-]/g, '-')
                .replace(/[/\\]/g, '_');
            return `${path}__${name}`;
        },
        getJSON: extractor.getJSON,
    } : false,
    plugins: [
        autoprefixer({ grid: 'autoplace' }),
        ...(config.style.modules ? [extractor.plugin] : []),
    ],
});
