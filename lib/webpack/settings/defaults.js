"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = {
    compilation: {
        extensions: ['.js', '.ts', '.scss', '.css'],
        externalFiles: [{
                from: './src/resources',
                to: 'resources',
                ignore: ['*.md'],
            }],
    },
};