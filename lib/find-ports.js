"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getPort = require("get-port");
var synchronizedPromise = require("synchronized-promise");
var getPortSync = synchronizedPromise(getPort);
exports.findPort = function (port, range) {
    if (range === void 0) { range = 999; }
    return getPortSync({
        port: getPort.makeRange(port, port + range),
    });
};
exports.findPorts = function (ports, range) { return ports
    .map(function (port) { return exports.findPort(port, range); }); };
