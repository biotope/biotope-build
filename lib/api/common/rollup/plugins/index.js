"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babel = require("rollup-plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const postcss = require("rollup-plugin-postcss");
const rollup_plugin_terser_1 = require("rollup-plugin-terser");
const rawTypescript = require("rollup-plugin-typescript2");
const json_1 = require("./json");
const bundle_extract_1 = require("./bundle-extract");
const typescript = rawTypescript;
exports.innerPlugins = {
    babel,
    commonjs,
    nodeResolve,
    postcss,
    terser: rollup_plugin_terser_1.terser,
    typescript,
    json: json_1.json,
    bundleExtract: bundle_extract_1.bundleExtract,
};
