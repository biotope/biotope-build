(function() {
    "use strict";
    var __spreadArrays = this && this.__spreadArrays || function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
        k++) r[k] = a[j];
        return r;
    };
    if (window && !window.require) {
        var extensionTypes_1 = {
            executable: [ "js" ],
            object: [ "json" ]
        };
        var createElementAndSet_1 = function(tag, prop, value) {
            var element = document.createElement(tag);
            element[prop] = value;
            return element;
        };
        var lastOf_1 = function(nodes) {
            return [].slice.call(nodes).reverse()[0];
        };
        var someEquals_1 = function(array, value) {
            return array.filter(function(item) {
                return item === value;
            }).length > 0;
        };
        var toExtensionType_1 = function(extension) {
            return Object.keys(extensionTypes_1).filter(function(key) {
                return someEquals_1(extensionTypes_1[key], extension);
            })[0];
        };
        var getCurrentPath_1 = function(url) {
            return createElementAndSet_1("a", "href", url).pathname.split("/").reverse().slice(1).reverse().filter(function(slug) {
                return !!slug;
            }).join("/");
        };
        var resolveRelativity_1 = function(path, currentPath) {
            var result = path === "." ? "index.js" : path;
            return (result.indexOf("./") === 0 ? result.substr(2) : result).split("/").reduce(function(accumulator, slug) {
                return __spreadArrays(slug === ".." ? accumulator.slice(0, accumulator.length - 1) : accumulator, slug === "." ? [ currentPath ] : [], slug.indexOf(".") !== 0 ? [ slug ] : []);
            }, currentPath.split("/")).filter(function(slug) {
                return !!slug;
            }).join("/").replace(":/", "://");
        };
        var fetchSync_1 = function(url) {
            var request = new XMLHttpRequest();
            request.open("GET", url, false);
            request.setRequestHeader("Content-Type", "text/plain");
            request.send();
            return request.status === 200 ? request.responseText : undefined;
        };
        var getExports_1 = function(fullRequire, url, code) {
            var module = {
                exports: {}
            };
            var newCurrentPath = getCurrentPath_1(url);
            var innerRequire = fullRequire.bind(window, false, newCurrentPath);
            new Function("exports", "require", "module", "__filename", "__dirname", code).call(window, module.exports, innerRequire, module, url, newCurrentPath);
            return module.exports;
        };
        var require_1 = function(rootRequire, currentPath, file) {
            var extension = toExtensionType_1(file.split(".").pop());
            var scriptSource = (lastOf_1(document.querySelectorAll("script")) || {}).src;
            var path = rootRequire && scriptSource ? getCurrentPath_1(scriptSource) : currentPath;
            var url = window.location.origin + "/" + resolveRelativity_1(file, path);
            try {
                var value = fetchSync_1(url);
                if (value === undefined) {
                    return undefined;
                }
                switch (extension) {
                  case "executable":
                    return getExports_1(require_1, url, value);

                  case "object":
                    return JSON.parse(value);

                  default:
                    return value;
                }
            } catch (error) {
                console.error(error);
                return undefined;
            }
        };
        var rootPath = getCurrentPath_1(window.location.href.indexOf("/") === window.location.href.length - 1 ? window.location.href.slice(0, window.location.href.length - 1) : window.location.href);
        window.require = require_1.bind(window, true, rootPath);
    }
})();