"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
exports.getEntryPoints = function (entryPoint, paths) {
    var filename = '';
    [/\.ts$/, /\.tsx$/, /\.js$/].some(function (regex) {
        if (regex.test(entryPoint.file)) {
            filename = entryPoint.file.replace(regex, '');
            return true;
        }
        return false;
    });
    var template = path_1.resolve(paths.pagesAbsolute + "/" + (entryPoint.template || filename + ".template.ejs"));
    var hasTemplate = fs_1.existsSync(template);
    return {
        file: entryPoint.file,
        template: hasTemplate ? template : path_1.resolve(paths.assetsAbsolute + "/template.ejs"),
        filename: path_1.resolve(paths.distAbsolute + "/" + ((!(/\/index$/.test(filename)) && filename !== 'index') ? filename + "/index" : filename) + ".html"),
    };
};
