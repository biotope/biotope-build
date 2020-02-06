"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const resolver_1 = require("../resolver");
const require_1 = require("../require");
const emit_1 = require("../emit");
const create_inputs_1 = require("./create-inputs");
const manual_chunks_1 = require("./manual-chunks");
const config_1 = require("./plugins/config");
const plugins_1 = require("./plugins");
const getLegacyBanner = (config, legacy) => (legacy && config.legacy.inline ? require_1.getContent(true) : '');
const createBuild = (config, legacy, input, warnings, outputFiles, addFile, removeFile, triggerBuild) => ({
    build: {
        input,
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
            sourcemap: true,
        },
        priorityPlugins: [],
        plugins: [],
        pluginsConfig: {
            postcss: [config_1.postcss(config, legacy)],
            commonjs: [config_1.commonJs()],
            alias: [config_1.alias(config)],
            nodeResolve: [config_1.nodeResolve(config)],
            typescript: !legacy ? [config_1.typescript()] : undefined,
            babel: legacy ? [config_1.babel(config)] : undefined,
            json: [],
            terser: config.production ? [] : undefined,
            bundleExtract: [config_1.bundleExtract(config, legacy, addFile)],
        },
        watch: {
            chokidar: true,
        },
        manualChunks: manual_chunks_1.manualChunks('vendor', config.chunks || {}, legacy ? config.legacy : false),
    },
    legacy,
    warnings,
    outputFiles,
    addFile,
    removeFile,
    triggerBuild,
});
exports.createPreBuilds = (config) => {
    const warnings = {};
    const outputFiles = {};
    const addFile = emit_1.getAddFileFunction(config, outputFiles);
    const removeFile = emit_1.getRemoveFileFunction(outputFiles);
    const inputs = [...Array(config.legacy ? 2 : 1)].map((_, index) => ({
        legacy: index !== 0,
        input: create_inputs_1.createInputs(config.project, config.extLogic, (index !== 0 && !config.legacy.only)
            ? config.legacy.suffix
            : '', resolver_1.resolver(config.exclude.map((folder) => `${config.project}/${folder}`), false, config.extLogic)),
    })).filter((_, index) => index !== 0 || (config.legacy && !config.legacy.only));
    const designatedTriggerInput = inputs[0].input[Object.keys(inputs[0].input)[0]];
    const triggerBuild = (file) => {
        const intendedFile = file || designatedTriggerInput;
        if (config.watch && intendedFile) {
            fs_extra_1.writeFileSync(intendedFile, fs_extra_1.readFileSync(intendedFile));
        }
    };
    return inputs.map(({ legacy, input }) => createBuild(config, legacy, input, warnings, outputFiles, addFile, removeFile, triggerBuild));
};
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
        legacy: builds[index].legacy,
        outputFiles: builds[index].outputFiles,
        warnings: builds[index].warnings,
        addFile: builds[index].addFile,
        removeFile: builds[index].removeFile,
        triggerBuild: builds[index].triggerBuild,
    }));
};
