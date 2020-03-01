"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alias = require("@rollup/plugin-alias");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const babel = require("rollup-plugin-babel");
const postcss = require("rollup-plugin-postcss");
const rollup_plugin_terser_1 = require("rollup-plugin-terser");
const rawTypescript = require("rollup-plugin-typescript2");
const json_1 = require("./json");
const exclude_1 = require("./exclude");
const bundle_extract_1 = require("./bundle-extract");
const typescript = rawTypescript;
exports.innerPlugins = {
    alias,
    babel,
    bundleExtract: bundle_extract_1.bundleExtract,
    commonjs,
    exclude: exclude_1.exclude,
    json: json_1.json,
    nodeResolve,
    postcss,
    replace,
    terser: rollup_plugin_terser_1.terser,
    typescript,
};
