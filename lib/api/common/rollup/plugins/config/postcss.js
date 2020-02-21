"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const postcss_1 = require("postcss");
const autoprefixer = require("autoprefixer");
const json_handlers_1 = require("../../../json-handlers");
const safeName = (name) => name.replace(/[&#,+()$~%.'":*?<>{}\s-]/g, '-').replace(/[/\\]/g, '_');
const projectName = safeName(json_handlers_1.requireJson(path_1.resolve(`${process.cwd()}/package.json`)).name);
const createExtractor = (localCss, originalNames = []) => ({
    originalNames,
    plugin: postcss_1.plugin('biotope-build-postcss-plugin-content-extractor', () => (root) => {
        const result = root.toResult().css;
        if (root.source && root.source.input.file && result.indexOf(':export') === -1) {
            localCss[root.source.input.file] = result;
        }
    })(),
    getJSON: (filename, cssModules) => {
        if (localCss[filename]) {
            Object.keys(cssModules)
                .filter((key) => !originalNames.includes(cssModules[key]))
                .forEach((key) => {
                localCss[filename] = localCss[filename].replace(new RegExp(`\\.${key}`, 'g'), `.${cssModules[key]}`);
            });
            cssModules.default = localCss[filename];
        }
    },
});
exports.postcss = (config, extracted, extractor = createExtractor(extracted)) => ({
    extensions: config.extStyle,
    extract: !!config.style.extract,
    inject: false,
    minimize: config.production,
    modules: config.style.modules ? {
        camelCase: true,
        generateScopedName(name, file, css) {
            if (config.style.global) {
                return name;
            }
            if (css.indexOf(`.${name}`) < 0) {
                extractor.originalNames.push(name);
                return name;
            }
            const path = safeName(file.replace(`${path_1.resolve(`${process.cwd()}/${config.project}`)}/`, ''));
            return `${projectName}__${path}__${name}`;
        },
        getJSON: extractor.getJSON,
    } : false,
    plugins: [
        autoprefixer({ grid: 'autoplace' }),
        ...(config.style.modules ? [extractor.plugin] : []),
    ],
});
