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
var path_1 = require("path");
var mergeDeep = require("merge-deep");
var pathDefaults = {
    app: './src/',
    assetsRelative: 'assets/',
    pagesRelative: 'pages/',
    dist: './dist/',
    buildRelative: 'build/',
};
var baseAbsolute = path_1.resolve('./');
exports.getPaths = function (paths) {
    if (paths === void 0) { paths = {}; }
    var pathsDefined = mergeDeep(pathDefaults, paths);
    return __assign({}, pathsDefined, { server: '/', baseAbsolute: baseAbsolute, appAbsolute: path_1.resolve(baseAbsolute + "/" + pathsDefined.app), assetsAbsolute: path_1.resolve(baseAbsolute + "/" + pathsDefined.app + "/" + pathsDefined.assetsRelative), pagesAbsolute: path_1.resolve(baseAbsolute + "/" + pathsDefined.app + "/" + pathsDefined.pagesRelative), distAbsolute: path_1.resolve(baseAbsolute + "/" + pathsDefined.dist), buildAbsolute: path_1.resolve(baseAbsolute + "/" + pathsDefined.dist + "/" + pathsDefined.buildRelative) });
};
