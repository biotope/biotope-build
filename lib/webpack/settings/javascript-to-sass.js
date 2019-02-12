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
var flattenObject = function (variables, prefix) {
    if (prefix === void 0) { prefix = ''; }
    return Object.keys(variables)
        .reduce(function (accumulator, key) {
        var _a;
        return (__assign({}, accumulator, (typeof variables[key] === 'object'
            ? flattenObject(variables[key], "" + prefix + (prefix ? '_' : '') + key)
            : (_a = {}, _a["" + prefix + (prefix ? '_' : '') + key] = variables[key], _a))));
    }, {});
};
exports.javascriptToSass = function (variables) {
    var flattenVariables = flattenObject(variables);
    return Object.keys(flattenVariables)
        .reduce(function (accumulator, key) { return accumulator + "$" + key + ":'" + flattenVariables[key] + "';"; }, '');
};
