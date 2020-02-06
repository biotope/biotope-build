"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bundleOverrides = ['commonjsHelpers.js', 'rollupPluginBabelHelpers.js'];
exports.invertObject = (vendors) => Object
    .keys(vendors)
    .reduce((accumulator, name) => (Object.assign(Object.assign({}, accumulator), (vendors[name].reduce((acc, vendor) => (Object.assign(Object.assign({}, acc), { [vendor]: name })), {})))), {});
exports.manualChunks = (folder, chunks, legacy) => {
    const invertedChunks = exports.invertObject(chunks);
    const invertedChunksKeys = Object.keys(invertedChunks);
    return (path) => {
        const relativePath = path
            .replace(process.cwd(), '')
            .split('/')
            .filter((slug) => !!slug)
            .join('/');
        const pathClean = path.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        const hasDelimiters = pathClean !== path;
        if (relativePath.includes('node_modules')) {
            const libPath = relativePath.slice(relativePath.indexOf('node_modules/') + 'node_modules/'.length);
            const lib = libPath.split('/').splice(0, libPath.indexOf('@') === 0 ? 2 : 1).join('/');
            return !invertedChunksKeys.includes(lib)
                ? `${folder}/bundle${legacy ? legacy.suffix : ''}`
                : `${folder}/${invertedChunks[lib].split('/').join('-')}${legacy ? legacy.suffix : ''}`;
        }
        return (hasDelimiters || bundleOverrides.includes(pathClean))
            ? `${folder}/bundle${legacy ? legacy.suffix : ''}`
            : undefined;
    };
};
