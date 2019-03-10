"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_file_1 = require("../config-file");
var compilation_1 = require("./compilation");
var compilation = function (options) {
    var compiler = compilation_1.getCompiler(__assign({}, options, { config: config_file_1.getConfigFile(options.config, options.additionalCompilation) }));
    if (!options.watch) {
        compiler.run(compilation_1.compilerCallback());
    }
    else {
        console.log('@biotope/build is watching the files…\n');
        compiler.watch({}, compilation_1.compilerCallback(!!options.open, !!options.spa));
    }
};
exports.registerCompile = function (program) { return program
    .command('compile')
    .option('-c, --config <file>', 'Specify a configuration file (ts or js)')
    .option('-a, --additional-compilation <pattern>', 'Specify a pattern of files to be compiled before running')
    .option('-e, --environment <name>', 'Specify the environment name (local, dev or prod)')
    .option('-w, --watch', 'Watch files and recompile them')
    .option('-o, --open', 'Serve and open files (requires --watch)')
    .option('-s, --spa', 'Single-page application when watching (must contain an index.html file in root)')
    .action(compilation); };
