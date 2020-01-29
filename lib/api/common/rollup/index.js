"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolver_1 = require("../resolver");
const create_inputs_1 = require("../create-inputs");
const manual_chunks_1 = require("../manual-chunks");
const require_1 = require("../require");
const config_1 = require("./plugins/config");
const plugins_1 = require("./plugins");
const getLegacyBanner = (config, legacy) => (legacy && config.legacy.inline ? require_1.getContent(true) : '');
const createBuild = (config, legacy) => {
    const warnings = {};
    const outputFiles = {};
    return {
        build: {
            input: create_inputs_1.createInputs(config.project, config.extLogic, legacy ? config.legacy.suffix : '', resolver_1.resolver(config.exclude.map((folder) => `${config.project}/${folder}`), false, config.extLogic)),
            onwarn(warning) {
                warnings[warning.code || 'BIOTOPE_BUILD_UNKNOWN'] = [
                    ...(warnings[warning.code || 'BIOTOPE_BUILD_UNKNOWN'] || []),
                    warning,
                ];
            },
            output: {
                dir: config.output,
                format: !legacy ? 'esm' : 'cjs',
                chunkFileNames: '[name].js',
                banner: getLegacyBanner(config, legacy),
                sourcemap: !config.production,
            },
            priorityPlugins: [],
            plugins: [],
            pluginsConfig: {
                postcss: [config_1.postcss(config, legacy)],
                commonjs: [config_1.commonJs()],
                nodeResolve: [config_1.nodeResolve(config)],
                typescript: !legacy ? [config_1.typescript()] : undefined,
                babel: legacy ? [config_1.babel(config)] : undefined,
                terser: config.production ? [] : undefined,
                json: [],
                bundleExtract: [config_1.bundleExtract(config, legacy, outputFiles)],
            },
            manualChunks: manual_chunks_1.manualChunks('vendor', config.chunks || {}, legacy ? config.legacy : false),
        },
        warnings,
        outputFiles,
    };
};
exports.createPreBuilds = (config) => ([
    createBuild(config, false),
    ...(config.legacy ? [createBuild(config, true)] : []),
]);
exports.finalizeBuilds = (builds) => {
    const rollupBuilds = builds
        .reduce((accumulator, { build }) => [...accumulator, Object.keys(build).reduce((acc, key) => (Object.assign(Object.assign(Object.assign({}, acc), (key !== 'pluginsConfig' && key !== 'priorityPlugins' ? { [key]: build[key] } : {})), (key === 'pluginsConfig' ? {
            plugins: [
                ...(build.priorityPlugins || []),
                ...Object.keys(build.pluginsConfig)
                    .filter((name) => Array.isArray(build.pluginsConfig[name]))
                    .map((name) => plugins_1.innerPlugins[name](...build.pluginsConfig[name])),
                ...(build.plugins || []),
            ],
        } : {}))), {})], []);
    return builds.map((_, index) => ({
        build: rollupBuilds[index],
        outputFiles: builds[index].outputFiles,
        warnings: builds[index].warnings,
    }));
};
