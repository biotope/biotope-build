"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var getRandomName = function (length) {
    if (length === void 0) { length = 16; }
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var text = '';
    while (text.length < length) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
exports.getCoreBundleName = function () {
    var packageJson = path_1.resolve(process.cwd() + "/package.json");
    var name = '';
    if (fs_1.existsSync(packageJson)) {
        (name = require(packageJson).name);
    }
    return name || getRandomName();
};
