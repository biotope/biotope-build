"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.bundleExtract = ({ legacy, isInline, production, styleExtracted, addFile, }) => ({
    name: 'biotope-build-rollup-plugin-extract',
    generateBundle(_, bundle) {
        if (legacy && !isInline) {
            addFile({
                name: 'require.js',
                content: require_1.getContent(production),
            });
        }
        Object.keys(bundle).forEach((key) => {
            let filename = key;
            if (styleExtracted && key.slice(-4) === '.css') {
                filename = 'index.css';
            }
            addFile({
                name: filename,
                content: getOutputContent(bundle[key]),
                mapping: bundle[key].map,
            });
            delete bundle[key];
        });
    },
});
