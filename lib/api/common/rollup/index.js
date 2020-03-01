"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const require_1 = require("../require");
const emit_1 = require("../emit");
const create_inputs_1 = require("./create-inputs");
const manual_chunks_1 = require("./manual-chunks");
const config_1 = require("./plugins/config");
const plugins_1 = require("./plugins");
const getBanner = (config, legacy) => (legacy && config.legacy && config.legacy.require && config.legacy.require !== 'file' ? require_1.getContent(!config.debug) : '');
const createBuild = (config, legacy, input, outputFiles, warnings, extractedStyle, addFile, removeFile, triggerBuild) => ({
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
            exports: 'named',
            chunkFileNames: '[name].js',
            banner: getBanner(config, legacy),
            sourcemap: true,
            esModule: false,
        },
        priorityPlugins: [],
        plugins: [],
        pluginsConfig: {
            alias: [config_1.alias(config)],
            postcss: [config_1.postcss(config, extractedStyle)],
            replace: [config_1.replace(legacy)],
            commonjs: [config_1.commonJs(config)],
            nodeResolve: [config_1.nodeResolve(config)],
            exclude: [config_1.exclude(config, legacy)],
            typescript: !legacy ? [config_1.typescript()] : undefined,
            babel: legacy ? [config_1.babel(config)] : undefined,
            json: [],
            terser: config.production ? [] : undefined,
            bundleExtract: [config_1.bundleExtract(config, legacy, extractedStyle, addFile)],
        },
        watch: {
            chokidar: true,
        },
        manualChunks: manual_chunks_1.manualChunks('vendor', config, legacy),
    },
    legacy,
    warnings,
    outputFiles,
    addFile,
    removeFile,
    triggerBuild,
});
exports.createPreBuilds = (config) => {
    const outputFiles = {};
    const warnings = {};
    const extractedStyle = {};
    const addFile = emit_1.getAddFileFunction(config, outputFiles);
    const removeFile = emit_1.getRemoveFileFunction(outputFiles);
    const inputsModules = (!config.legacy || !config.legacy.only)
        ? create_inputs_1.createInputs(config, false)
        : undefined;
    const inputsLegacy = (!inputsModules || config.legacy) ? create_inputs_1.createInputs(config, true) : undefined;
    const inputs = [
        ...(inputsModules ? [inputsModules] : []),
        ...(inputsLegacy ? [inputsLegacy] : []),
    ];
    const designatedTriggerInput = inputs[0][Object.keys(inputs[0])[0]];
    const triggerBuild = (file) => {
        const intendedFile = file || designatedTriggerInput;
        if (config.watch && intendedFile) {
            fs_extra_1.writeFileSync(intendedFile, fs_extra_1.readFileSync(intendedFile));
        }
    };
    return inputs.map((input, index) => createBuild(config, !inputsModules || index > 0, input, outputFiles, warnings, extractedStyle, addFile, removeFile, triggerBuild));
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
