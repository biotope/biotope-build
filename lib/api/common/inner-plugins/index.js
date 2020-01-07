"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const babel = require("rollup-plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const json = require("@rollup/plugin-json");
const postcss = require("rollup-plugin-postcss");
const rollup_plugin_terser_1 = require("rollup-plugin-terser");
const rawTypescript = require("rollup-plugin-typescript2");
const typescript = rawTypescript;
__export(require("./babel"));
__export(require("./commonjs"));
__export(require("./node-resolver"));
__export(require("./postcss"));
__export(require("./typescript"));
exports.innerPlugins = {
    babel,
    commonjs,
    nodeResolve,
    postcss,
    terser: rollup_plugin_terser_1.terser,
    typescript,
    json,
};
