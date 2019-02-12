"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript = require("typescript");
exports.tsc = function (fileNames, options) {
    var program = typescript.createProgram(fileNames, options);
    var exitCode = program.emit().emitSkipped ? 1 : 0;
    if (exitCode) {
        process.exit(exitCode);
        console.log("Process exiting with code '" + exitCode + "'.");
    }
};
