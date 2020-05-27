"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleExtract = void 0;
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
exports.bundleExtract = ({ isLegacyBuild, production, style, extracted, legacy, addFile, }) => ({
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
            if (isCssFile && style.extract && (!isLegacyBuild || legacy.only)) {
                addFile({
                    name: `${style.extractName}.css`,
                    content: Object.keys(extracted)
                        .filter((file) => (!style.extractExclude || !(new RegExp(style.extractExclude)).test(file)))
                        .reduce((css, file) => [...css, extracted[file].toString()], [])
                        .join('\n'),
                });
            }
            else if (!isCssFile) {
                addFile({
                    name,
                    content: getOutputContent(bundle[name]),
                    mapping: bundle[name].map,
                });
            }
            delete bundle[name];
        });
    },
});
