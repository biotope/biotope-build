module.exports = {
    defaultPump: (config) => {
        const path = require('path');
        const named = require('vinyl-named');
        const webpack = require('webpack');
        const webpackStream = require('webpack-stream');
        const webpackConfig = require('./../webpack.config.js');

        const namedTask = named((file) => {
            const currentResourceParsed = path.parse(config.global.resources);
            let relativePath = path.relative(file.base, file.path);

            if(!relativePath.startsWith(currentResourceParsed.name)) {
                relativePath = path.join(currentResourceParsed.name, relativePath);
            }

            if(relativePath.endsWith('.ts')) {
                relativePath = relativePath.slice(0, -3);
            }

            return relativePath;
        });

        return [
            namedTask,
            webpackStream(webpackConfig, webpack)
        ];
    }
};