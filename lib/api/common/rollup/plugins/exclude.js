"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude = void 0;
exports.exclude = ({ isLegacyBuild, legacy }) => {
    const excludePackages = (!isLegacyBuild && legacy ? legacy.exclusivePackages : [])
        .map((packageName) => `node_modules/${packageName}`);
    return {
        name: 'biotope-build-rollup-plugin-exclude',
        transform: (_, id) => (excludePackages.some((name) => id.indexOf(name) > -1) ? ({ code: '' }) : undefined),
    };
};
