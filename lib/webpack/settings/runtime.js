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
var fs_1 = require("fs");
var path_1 = require("path");
var mergeDeep = require("merge-deep");
var dotenv_1 = require("dotenv");
var getDotEnv = function (paths) {
    try {
        return dotenv_1.parse(fs_1.readFileSync(path_1.resolve(paths.baseAbsolute + "/.env")));
    }
    catch (_) {
        return {};
    }
};
var filterEnvironments = function (runtimeVariables) { return Object
    .keys(runtimeVariables)
    .filter(function (key) { return key !== 'local' && key !== 'development' && key !== 'production'; })
    .reduce(function (accumulator, key) {
    var _a;
    return (__assign({}, accumulator, (_a = {}, _a[key] = runtimeVariables[key], _a)));
}, {}); };
exports.getRuntime = function (runtime, environment, paths) { return mergeDeep(mergeDeep(filterEnvironments(runtime), runtime[environment]), getDotEnv(paths)); };
