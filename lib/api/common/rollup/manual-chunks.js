"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bundleOverrides = ['commonjsHelpers.js', 'rollupPluginBabelHelpers.js'];
exports.invertObject = (vendors) => Object
    .keys(vendors)
    .reduce((accumulator, name) => (Object.assign(Object.assign({}, accumulator), (vendors[name].reduce((acc, vendor) => (Object.assign(Object.assign({}, acc), { [vendor]: name })), {})))), {});
exports.manualChunks = (folder, config, isLegacyBuild) => {
    const suffix = isLegacyBuild && config.legacy ? config.legacy.suffix : '';
    const invertedChunks = exports.invertObject(config.chunks || {});
    const invertedChunksKeys = Object.keys(invertedChunks);
    const bundleFile = `${folder}/bundle${suffix}`;
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
                ? bundleFile
                : `${folder}/${invertedChunks[lib].split('/').join('-')}${suffix}`;
        }
        return (hasDelimiters || bundleOverrides.includes(pathClean)) ? bundleFile : undefined;
    };
};
