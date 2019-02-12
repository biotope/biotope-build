"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalWebServer = require("local-web-server");
var os = require("os");
var reduceFlatten = require("reduce-flatten");
var PORT = 8000;
exports.serve = function (options) {
    (new LocalWebServer()).listen({
        port: PORT,
        https: options.production,
        compress: options.production,
        directory: options.directory || 'dist',
        spa: options.spa ? 'index.html' : undefined,
    });
    var ipList = Object.keys(os.networkInterfaces())
        .map(function (key) { return os.networkInterfaces()[key]; })
        .reduce(reduceFlatten, [])
        .filter(function (networkInterface) { return networkInterface.family === 'IPv4'; })
        .map(function (networkInterface) { return networkInterface.address; });
    ipList.unshift(os.hostname());
    var urls = ipList.map(function (address) { return "http" + (options.production ? 's' : '') + "://" + address + ":" + PORT; });
    console.log("Serving at " + urls.join(', '));
    if (options.open) {
        require('opn')(urls[1]);
    }
};
