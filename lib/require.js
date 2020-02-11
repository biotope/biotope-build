(function() {
    "use strict";
    var __spreadArrays = this && this.__spreadArrays || function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
        k++) r[k] = a[j];
        return r;
    };
    var createElementAndSet = function(tag, prop, value) {
        var element = document.createElement(tag);
        element[prop] = value;
        return element;
    };
    var lastOf = function(nodes) {
        return [].slice.call(nodes).reverse()[0];
    };
    var getCurrentPath = function(url) {
        return createElementAndSet("a", "href", url).pathname.split("/").reverse().slice(1).reverse().filter(function(slug) {
            return !!slug;
        }).join("/");
    };
    var resolveRelativity = function(path, currentPath) {
        var result = path === "." ? "index.js" : path;
        return (result.indexOf("./") === 0 ? result.substr(2) : result).split("/").reduce(function(accumulator, slug) {
            return __spreadArrays(slug === ".." ? accumulator.slice(0, accumulator.length - 1) : accumulator, slug === "." ? [ currentPath ] : [], slug.indexOf(".") !== 0 ? [ slug ] : []);
        }, currentPath.split("/")).filter(function(slug) {
            return !!slug;
        }).join("/").replace(":/", "://");
    };
    var fetchSync = function(url) {
        var request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.setRequestHeader("Content-Type", "text/plain");
        request.send();
        return request.status === 200 ? request.responseText : undefined;
    };
    var removeSourceMaps = function(code) {
        return code.replace(new RegExp("\\/\\/\\# sourceMappingURL\\=.*"), "");
    };
    var runAndCache = function(url, code) {
        var script = createElementAndSet("script", "innerHTML", '\n    ;(function() {\n      var module = window.require.__cache["' + url + '"].module;\n      var newPath = "' + getCurrentPath(url) + '";\n      function exec(exports, require, module, __filename, __dirname) {;\n        ' + removeSourceMaps(code || "") + '\n      ;}\n      exec.call(window, module.exports, window.require.__base.bind(window, false, newPath), module, "' + url + '", newPath);\n    })();\n  ');
        document.body.appendChild(script);
        document.body.removeChild(script);
    };
    var isCached = function(url) {
        return Object.keys(window.require.__cache).indexOf(url) >= 0;
    };
    var getCached = function(url) {
        return window.require.__cache[url];
    };
    var requireBase = function(rootRequire, currentPath, file) {
        var scriptSource = (lastOf(document.querySelectorAll("script")) || {}).src;
        var path = rootRequire && scriptSource ? getCurrentPath(scriptSource) : currentPath;
        var url = window.location.origin + "/" + resolveRelativity(file, path);
        if (isCached(url)) {
            return getCached(url).module.exports;
        }
        var module = {
            exports: {}
        };
        Object.freeze(module);
        window.require.__cache[url] = {
            module: module
        };
        runAndCache(url, fetchSync(url) || "");
        return getCached(url).module.exports;
    };
    if (window && !window.require) {
        var rootPath = typeof window.__require_root === "string" ? window.__require_root : getCurrentPath(window.location.href.indexOf("/") === window.location.href.length - 1 ? window.location.href.slice(0, window.location.href.length - 1) : window.location.href);
        window.require = requireBase.bind(window, true, rootPath);
        window.require.__base = requireBase;
        window.require.__cache = {};
    }
})();