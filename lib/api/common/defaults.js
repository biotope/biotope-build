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
    extLogic: '.js,.ts',
    extStyle: '.css,.scss',
    legacy: false,
    serve: false,
    chunks: false,
};
exports.defaultConfigs = {
    legacy: {
        inline: false,
        suffix: '.legacy',
    },
    serve: {
        port: 8000,
        open: true,
        spa: false,
        secure: false,
    },
    chunks: {
        'biotope-element': ['@biotope/element'],
    },
};
exports.defaultPlugins = ['serve', 'livereload', 'components-json', 'logger'];
