"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var loader_utils_1 = require("loader-utils");
var project_paths_1 = require("./project-paths");
var LOADER_CONTENT_FILE = path_1.resolve(project_paths_1.biotopeLibPath + "/webpack/settings/style-loader-content.js");
var styleLoader = function () { };
styleLoader.pitch = function (request) {
    var context = this;
    var content = fs_1.readFileSync(LOADER_CONTENT_FILE, 'utf8');
    return content.replace('__STYLE__', loader_utils_1.stringifyRequest(context, "!!" + request));
};
module.exports = styleLoader;
