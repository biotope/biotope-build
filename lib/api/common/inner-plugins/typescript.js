"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TYPESCRIPT_ES6_CONFIG = {
    compilerOptions: {
        target: 'es6',
    },
};
exports.getTypescriptConfig = () => ({
    typescript: require('typescript'),
    tsconfigOverride: TYPESCRIPT_ES6_CONFIG,
});
