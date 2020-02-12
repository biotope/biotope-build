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
exports.bundleExtract = ({ isLegacyBuild, production, style, legacy, addFile, }) => ({
    name: 'biotope-build-rollup-plugin-extract',
    generateBundle(_, bundle) {
        if (isLegacyBuild && legacy.require === 'file') {
            addFile({
                name: 'require.js',
                content: require_1.getContent(production),
            });
        }
        Object.keys(bundle).forEach((name) => {
            const isCssFile = name.slice(-4) === '.css';
            const content = getOutputContent(bundle[name]);
            const mapping = bundle[name].map;
            if (isCssFile && style.extract && (!isLegacyBuild || legacy.only)) {
                addFile({ name: `${style.extractName}.css`, content, mapping });
            }
            else if (!isCssFile) {
                addFile({ name, content, mapping });
            }
            delete bundle[name];
        });
    },
});
