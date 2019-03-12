"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var free_ports_1 = require("../../free-ports");
var serve_1 = require("./serve");
var firstTimeFinish = true;
exports.compilerCallback = function (open, spa) {
    if (open === void 0) { open = false; }
    if (spa === void 0) { spa = false; }
    return function (error, stats) {
        if (firstTimeFinish && open) {
            firstTimeFinish = false;
            var port = free_ports_1.freePorts([8000])[0];
            serve_1.serve({ open: open, port: port, spa: spa });
        }
        if (error) {
            console.error(error.stack || error);
            if (error.details) {
                console.error(error.details);
            }
            process.exit(1);
        }
        if (stats.compilation) {
            if (stats.compilation.errors.length !== 0) {
                stats.compilation.errors
                    .forEach(function (compilationError) { return console.error(compilationError.message); });
                process.exitCode = 2;
            }
            else {
                console.log(stats.toString({
                    colors: true,
                    cached: false,
                    cachedAssets: false,
                }));
            }
        }
    };
};
