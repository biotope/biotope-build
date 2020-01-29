"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const inner_plugins_1 = require("./inner-plugins");
const resolver_1 = require("./resolver");
const create_inputs_1 = require("./create-inputs");
const manual_chunks_1 = require("./manual-chunks");
const emit_1 = require("./emit");
const requirePath = path_1.resolve(`${__dirname}/../../require.min.js`);
const getLegacyBanner = (config, legacy) => (legacy && config.legacy.inline
    ? fs_extra_1.readFileSync(requirePath).toString()
    : '');
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
                        if (legacy && !config.legacy.inline) {
                            emit_1.addOutputFile('require.js', fs_extra_1.readFileSync(`${__dirname}/../../require${config.production ? '.min' : ''}.js`), outputFiles);
                        }
                        Object.keys(bundle).forEach((key) => {
                            emit_1.addOutputFile(key, getOutputContent(bundle[key]), outputFiles);
                            emit_1.removeOutputFile(key, bundle);
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
