"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emit_1 = require("../../emit");
const require_1 = require("../../require");
const getOutputContent = (output) => {
    if ((output.type === 'asset' || output.isAsset)
        && (typeof output.source === 'string' || output.source !== undefined)) {
        return output.source;
    }
    if ((output.type === 'chunk' || output.isAsset === undefined)
        && (typeof output.code === 'string' || output.code !== undefined)) {
        return output.code;
    }
    return '';
};
exports.bundleExtract = (options) => ({
    name: 'biotope-build-rollup-plugin-extract',
    generateBundle(_, bundle) {
        if (options.legacy && !options.isInline) {
            emit_1.addOutputFile('require.js', require_1.getContent(options.production), options.outputFiles);
        }
        Object.keys(bundle).forEach((key) => {
            emit_1.addOutputFile(key, getOutputContent(bundle[key]), options.outputFiles);
            emit_1.removeOutputFile(key, bundle);
        });
    },
});
