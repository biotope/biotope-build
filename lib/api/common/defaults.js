"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCliOptions = {
    config: '',
    project: 'src',
    exclude: 'resources',
    output: 'dist',
    copy: 'resources',
    watch: false,
    production: false,
    debug: false,
    componentsJson: 'components\\/.*\\/index\\.(j|t)s$',
    extLogic: '.js,.ts',
    extStyle: '.css,.scss',
    legacy: false,
    serve: false,
    chunks: false,
};
exports.defaultConfigs = {
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
    chunks: {
        'biotope-element': ['@biotope/element'],
    },
    style: {
        extract: false,
        global: false,
    },
    runtime: {},
};
exports.defaultPlugins = [
    'serve', 'livereload', 'logger', 'images', 'runtime', 'copy', 'components-json',
];
