"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TYPESCRIPT_ES6_CONFIG = {
    compilerOptions: {
        target: 'ES6',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
    },
};
exports.getTypescriptConfig = () => ({
    typescript: require('typescript'),
    tsconfigOverride: TYPESCRIPT_ES6_CONFIG,
});
