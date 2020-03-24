"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const postcss_1 = require("postcss");
const autoprefixer = require("autoprefixer");
const json_handlers_1 = require("../../../json-handlers");
const EXTRACTOR_PROP_NAME = 'default';
const classPrefix = `${json_handlers_1.safeName(json_handlers_1.requireJson(path_1.resolve(`${process.cwd()}/package.json`)).name)}--`;
const createExtractor = (localCss) => postcss_1.plugin('biotope-build-postcss-plugin-content-extractor', () => (root) => {
    root.walkRules((rule) => {
        if (rule.selector === ':export' && rule.nodes) {
            let value = root.toResult().css;
            value = value.substr(0, value.indexOf(':export {'));
            rule.nodes.push({ type: 'decl', prop: EXTRACTOR_PROP_NAME, value });
            if (root.source && root.source.input.file) {
                localCss[root.source.input.file] = value;
            }
        }
    });
});
const resolveOS = (file) => path_1.resolve(file).replace(new RegExp(path_1.sep, 'g'), '/');
exports.postcss = (config, extracted, extractor = createExtractor(extracted)) => ({
    extensions: config.extStyle,
    extract: !!config.style.extract,
    inject: false,
    minimize: config.production,
    modules: config.style.modules ? {
        camelCase: true,
        generateScopedName(name, file, css) {
            const { global, moduleExceptions } = config.style;
            const exceptionKey = Object
                .keys(moduleExceptions)
                .find((key) => resolveOS(key) === resolveOS(file));
            if (global || (exceptionKey && moduleExceptions[exceptionKey].includes(name))) {
                return name;
            }
            if (css.indexOf(`.${name}`) < 0) {
                return name;
            }
            const path = json_handlers_1.safeName(file.replace(`${path_1.resolve(`${process.cwd()}${path_1.sep}${config.project}`)}${path_1.sep}`, ''));
            return `${config.production ? classPrefix : ''}${path}--${name}`;
        },
    } : false,
    plugins: [
        autoprefixer({ grid: 'autoplace' }),
        ...(config.style.modules ? [extractor] : []),
    ],
});
