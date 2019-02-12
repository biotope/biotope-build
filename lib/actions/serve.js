"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compilation_1 = require("./compilation");
exports.registerServe = function (program) { return program
    .command('serve')
    .option('-d, --directory', 'Directory in which to serve')
    .option('-o, --open', 'Open the web-page on the default browser')
    .option('-p, --production', 'Serve with https and gzip')
    .option('-s, --spa', 'Single-page application (must contain an index.html file in root)')
    .action(compilation_1.serve); };
