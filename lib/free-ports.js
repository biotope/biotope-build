"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var findFreePortSync = require("find-free-port-sync");
exports.freePorts = function (ports, range) {
    if (range === void 0) { range = 99; }
    return ports
        .map(function (port) { return findFreePortSync({
        start: port,
        end: port + range,
    }); });
};
