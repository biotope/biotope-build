"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var LocalWebServer = require("local-web-server");
var reduceFlatten = require("reduce-flatten");
var DEFAULT_PORT = 8000;
exports.serve = function (options) {
    var port = options.port || DEFAULT_PORT;
    (new LocalWebServer()).listen({
        port: port,
        https: options.production,
        compress: options.production,
        directory: options.directory || 'dist',
        spa: options.spa ? 'index.html' : undefined,
    });
    var interfaces = os_1.networkInterfaces();
    var ipList = Object.keys(interfaces)
        .map(function (key) { return interfaces[key]; })
        .reduce(reduceFlatten, [])
        .filter(function (networkInterface) { return networkInterface.family === 'IPv4'; })
        .map(function (networkInterface) { return networkInterface.address; });
    ipList.unshift(os_1.hostname());
    var urls = ipList.map(function (address) { return "http" + (options.production ? 's' : '') + "://" + address + ":" + port; });
    console.log("Serving at " + urls.join(', '));
    if (options.open) {
        require('open')(urls[1]);
    }
};
