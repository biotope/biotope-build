(function(e) {
    "use strict";
    var t = this && this.__spreadArrays || function() {
        for (var e = 0, r = 0, n = arguments.length; r < n; r++) e += arguments[r].length;
        for (var t = Array(e), i = 0, r = 0; r < n; r++) for (var o = arguments[r], u = 0, a = o.length; u < a; u++, 
        i++) t[i] = o[u];
        return t;
    };
    if (!window.require) {
        var n = {
            executable: [ "js" ],
            object: [ "json" ]
        };
        var r = function(e, r, n) {
            var t = document.createElement(e);
            t[r] = n;
            return t;
        };
        var c = function(e) {
            return [].slice.call(e).reverse()[0];
        };
        var i = function(e, r) {
            return e.filter(function(e) {
                return e === r;
            }).length > 0;
        };
        var s = function(r) {
            return Object.keys(n).filter(function(e) {
                return i(n[e], r);
            })[0];
        };
        var l = function(e) {
            return r("a", "href", e).pathname.split("/").reverse().slice(1).reverse().filter(function(e) {
                return !!e;
            }).join("/");
        };
        var f = function(e, n) {
            var r = e === "." ? "index.js" : e;
            return (r.indexOf("./") === 0 ? r.substr(2) : r).split("/").reduce(function(e, r) {
                return t(r === ".." ? e.slice(0, e.length - 1) : e, r === "." ? [ n ] : [], r.indexOf(".") !== 0 ? [ r ] : []);
            }, n.split("/")).filter(function(e) {
                return !!e;
            }).join("/").replace(":/", "://");
        };
        var d = function(e) {
            var r = new XMLHttpRequest();
            r.open("GET", e, false);
            r.setRequestHeader("Content-Type", "text/plain");
            r.send();
            return r.status === 200 ? r.responseText : undefined;
        };
        var w = function(e, r, n) {
            var t = {
                exports: {}
            };
            var i = l(r);
            var o = e.bind(window, false, i);
            new Function("exports", "require", "module", "__filename", "__dirname", n).call(window, t.exports, o, t, r, i);
            return t.exports;
        };
        var v = function(e, r, n) {
            var t = s(n.split(".").pop());
            var i = (c(document.querySelectorAll("script")) || {}).src;
            var o = e && i ? l(i).split("/").reverse().slice(1).reverse().join("/") : r;
            var u = window.location.origin + "/" + f(n, o);
            try {
                var a = d(u);
                if (a === undefined) {
                    return undefined;
                }
                switch (t) {
                  case "executable":
                    return w(v, u, a);

                  case "object":
                    return JSON.parse(a);

                  default:
                    return a;
                }
            } catch (e) {
                console.error(e);
                return undefined;
            }
        };
        window.require = v.bind(window, true, l(window.location.href.indexOf("/") === window.location.href.length - 1 ? window.location.href.slice(0, window.location.href.length - 1) : window.location.href));
    }
})(typeof window == "undefined" ? window = {} : window);