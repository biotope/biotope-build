"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const inner_plugins_1 = require("./inner-plugins");
const resolver_1 = require("./resolver");
const create_inputs_1 = require("./create-inputs");
const manual_chunks_1 = require("./manual-chunks");
const requirePath = path_1.resolve(`${__dirname}/../../require.min.js`);
const getLegacyBanner = (config, legacy) => (legacy && config.legacy.inline
    ? fs_1.readFileSync(requirePath).toString()
    : '');
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
            plugins: [
                {
                    name: 'biotope-build-rollup-plugin-extract',
                    generateBundle(_, bundle) {
                        Object.keys(bundle).forEach((key) => {
                            outputFiles[key] = bundle[key].code || bundle[key].source || '';
                            delete bundle[key];
                        });
                    },
                },
            ],
            priorityPlugins: [],
            pluginsConfig: {
                postcss: [inner_plugins_1.getPostcssConfig(config, legacy)],
                commonjs: [inner_plugins_1.getCommonjsConfig()],
                nodeResolve: [inner_plugins_1.getNodeResolverConfig(config)],
                typescript: !legacy ? [inner_plugins_1.getTypescriptConfig()] : undefined,
                babel: legacy ? [inner_plugins_1.getBabelConfig(config)] : undefined,
                terser: config.production ? [] : undefined,
                json: [],
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
                    .map((name) => inner_plugins_1.innerPlugins[name](...build.pluginsConfig[name])),
                ...(build.plugins || []),
            ],
        } : {}))), {})], []);
    return builds.map((_, index) => ({
        build: rollupBuilds[index],
        outputFiles: builds[index].outputFiles,
        warnings: builds[index].warnings,
    }));
};
