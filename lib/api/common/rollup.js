"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const postcss_1 = require("postcss");
const rawTypescript = require("rollup-plugin-typescript2");
const rawNodeResolve = require("rollup-plugin-node-resolve");
const rawCommonjs = require("rollup-plugin-commonjs");
const postcss = require("rollup-plugin-postcss");
const rollup_plugin_terser_1 = require("rollup-plugin-terser");
const copy = require("rollup-plugin-copy-glob");
const autoprefixer = require("autoprefixer");
const babel = require("rollup-plugin-babel");
const babelPresetEnv = require("@babel/preset-env");
const babelPresetTypescript = require("@babel/preset-typescript");
const babelPluginProposalClassProperties = require("@babel/plugin-proposal-class-properties");
const babelPluginTransformClasses = require("@babel/plugin-transform-classes");
const babelPluginTransformObjectAssign = require("@babel/plugin-transform-object-assign");
const resolver_1 = require("./resolver");
const nodeResolve = rawNodeResolve;
const commonjs = rawCommonjs;
const typescript = rawTypescript;
const plugins = {
    postcss,
    copy,
    terser: rollup_plugin_terser_1.terser,
    babel,
    typescript,
    commonjs,
    nodeResolve,
};
const TYPESCRIPT_ES6_CONFIG = {
    compilerOptions: {
        target: 'es6',
    },
};
const requirePath = path_1.resolve(`${__dirname}/../../require.min.js`);
const getOutputName = (file, folder) => {
    const split = file.replace(path_1.resolve(`${process.cwd()}${folder ? `/${folder}` : ''}`), '')
        .split('/')
        .filter((slug) => !!slug);
    const nameSplit = split[split.length - 1].split('.');
    nameSplit.pop();
    split[split.length - 1] = nameSplit.join('.');
    while (split.length > 1 && split[split.length - 1] === 'index') {
        split.pop();
    }
    return split.join('/');
};
const createInputObject = (folder, extensions, suffix, excludes) => (resolver_1.resolver(extensions, [folder]).reduce((accumulator, files) => ([
    ...accumulator,
    ...(typeof files === 'string' ? [files] : files),
]), []).reduce((accumulator, file) => (Object.assign(Object.assign({}, accumulator), (excludes.indexOf(path_1.resolve(file)) >= 0 ? {} : {
    [`${getOutputName(file, folder)}${suffix}`]: path_1.resolve(file),
}))), {}));
const invertObject = (vendors) => Object
    .keys(vendors)
    .reduce((accumulator, name) => (Object.assign(Object.assign({}, accumulator), (vendors[name].reduce((acc, vendor) => (Object.assign(Object.assign({}, acc), { [vendor]: name })), {})))), {});
const manualChunks = (folder, chunks, legacy) => {
    const invertedChunks = invertObject(chunks);
    const invertedChunksKeys = Object.keys(invertedChunks);
    return (path) => {
        const relativePath = path
            .replace(process.cwd(), '')
            .split('/')
            .filter((slug) => !!slug)
            .join('/');
        if (relativePath.includes('node_modules')) {
            const libPath = relativePath.slice(relativePath.indexOf('node_modules/') + 'node_modules/'.length);
            const lib = libPath.split('/').splice(0, libPath.indexOf('@') === 0 ? 2 : 1).join('/');
            if (invertedChunksKeys.includes(lib)) {
                return `${folder}/${invertedChunks[lib].split('/').join('-')}${legacy ? legacy.suffix : ''}`;
            }
            return `${folder}/bundle${legacy ? legacy.suffix : ''}`;
        }
        return undefined;
    };
};
const createExtractor = (localCSS = {}) => ({
    getJSON: (filename, json) => {
        if (localCSS[filename]) {
            json.default = localCSS[filename];
        }
    },
    plugin: postcss_1.plugin('postcss-custom-content-extractor', () => (root) => {
        const result = root.toResult().css;
        if (root.source && root.source.input.file && result.indexOf(':export') === -1) {
            localCSS[root.source.input.file] = result;
        }
    })(),
});
const createBuild = (config, legacy, { getJSON, plugin } = createExtractor()) => ({
    input: createInputObject(config.project, config.extLogic, legacy ? config.legacy.suffix : '', resolver_1.resolver(config.extLogic, config.exclude.map((folder) => `${config.project}/${folder}`))),
    output: {
        dir: config.output,
        format: !legacy ? 'esm' : 'cjs',
        chunkFileNames: '[name].js',
        banner: legacy && config.legacy.inline
            ? fs_1.readFileSync(requirePath).toString()
            : '',
        sourcemap: !config.production,
    },
    plugins: [],
    pluginsConfig: Object.assign(Object.assign(Object.assign({ postcss: [{
                extensions: config.extStyle,
                inject: false,
                minimize: config.production,
                modules: {
                    camelCase: true,
                    generateScopedName: '[path]__[name]__[local]--[hash:base64:5]',
                    getJSON,
                },
                plugins: [
                    autoprefixer({ grid: 'autoplace' }),
                    plugin,
                ],
            }], commonjs: [{
                include: 'node_modules/**',
            }], nodeResolve: [{
                browser: true,
                extensions: config.extLogic,
            }] }, (!legacy ? {
        typescript: [{
                typescript: require('typescript'),
                tsconfigOverride: TYPESCRIPT_ES6_CONFIG,
            }],
    } : {
        babel: [{
                babelrc: false,
                extensions: config.extLogic,
                presets: [
                    babelPresetEnv,
                    babelPresetTypescript,
                ],
                plugins: [
                    [babelPluginProposalClassProperties, { loose: true }],
                    [babelPluginTransformClasses, { loose: true }],
                    babelPluginTransformObjectAssign,
                ],
            }],
    })), (config.production ? { terser: [] } : {})), { copy: [
            [
                ...config.copy.map((folder) => ({
                    files: `${config.project}/${folder}/**/*`,
                    dest: `${config.output}/${folder}`,
                })),
                ...(legacy && !config.legacy.inline
                    ? [{ files: requirePath, dest: config.output }]
                    : []),
            ],
            { watch: config.watch },
        ] }),
    manualChunks: manualChunks('vendor', config.chunks || {}, legacy ? config.legacy : false),
});
exports.createAllBuilds = (config) => ([
    createBuild(config, false),
    ...(config.legacy ? [createBuild(config, true)] : []),
]);
exports.finalizeBuilds = (builds) => builds
    .reduce((accumulator, build) => ([...accumulator, Object.keys(build).reduce((acc, key) => (Object.assign(Object.assign(Object.assign({}, acc), (key !== 'pluginsConfig' ? { [key]: build[key] } : {})), (key === 'pluginsConfig' ? {
        plugins: [
            ...Object.keys(build.pluginsConfig)
                .filter((pluginName) => Array.isArray(build.pluginsConfig[pluginName]))
                .map((pluginName) => plugins[pluginName](...build.pluginsConfig[pluginName])),
            ...(build.plugins || []),
        ],
    } : {}))), {})]), []);
