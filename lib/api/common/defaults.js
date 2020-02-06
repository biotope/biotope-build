"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCliOptions = {
    config: '',
    project: 'src',
    exclude: 'resources',
    output: 'dist',
    copy: 'resources,index.html',
    maps: true,
    watch: false,
    production: false,
    ignoreResult: false,
    debug: false,
    componentsJson: false,
    extLogic: '.js,.mjs,.ts',
    extStyle: '.css,.scss',
    legacy: false,
    serve: false,
    chunks: false,
};
exports.defaultConfigs = {
    componentsJson: 'components\\/.*\\/index\\.(j|t)s$',
    maps: {
        type: 'inline',
        environment: 'development',
    },
    legacy: {
        inline: true,
        suffix: '.legacy',
    },
    serve: {
        port: 8000,
        open: false,
        spa: false,
        secure: false,
    },
    chunks: {},
    style: {
        extract: false,
        global: false,
        modules: true,
    },
    alias: {},
    runtime: {},
};
exports.defaultPlugins = [
    'logger',
    'runtime',
    'images',
    'copy',
    'components-json',
    'remove-empty',
    'serve',
    'livereload',
];
