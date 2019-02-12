"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsconfigBase = require("../../tsconfig.base.json");
var compilation_1 = require("./compilation");
var configFiles = [
    '.babelrc.ts',
    'biotope-build.config.ts',
    'postcss.config.ts',
];
var compile = function (options) {
    compilation_1.tsc(configFiles, tsconfigBase);
    if (!options.watch) {
        compilation_1.getCompiler(options).run(compilation_1.compilerCallback());
    }
    else {
        console.log('@biotope/build is watching the files…\n');
        compilation_1.getCompiler(options).watch({}, compilation_1.compilerCallback(true, options.spa));
    }
};
exports.registerCompile = function (program) { return program
    .command('compile')
    .option('-c, --config <file>', 'An extention configuration file')
    .option('-e, --environment <file>', 'The requested environment')
    .option('-w, --watch', 'Watches files and recompiles them')
    .option('-s, --spa', 'Single-page application when watching (must contain an index.html file in root)')
    .action(compile); };
