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
            object: [ "json" ],
            style: [ "css" ]
        };
        var s = function(e, r, n) {
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
        var l = function(r) {
            return Object.keys(n).filter(function(e) {
                return i(n[e], r);
            })[0];
        };
        var f = function(e) {
            return s("a", "href", e).pathname.split("/").reverse().slice(1).reverse().filter(function(e) {
                return !!e;
            }).join("/");
        };
        var d = function(e, n) {
            var r = e === "." ? "index.js" : e;
            return (r.indexOf("./") === 0 ? r.substr(2) : r).split("/").reduce(function(e, r) {
                return t(r === ".." ? e.slice(0, e.length - 1) : e, r === "." ? [ n ] : [], r.indexOf(".") !== 0 ? [ r ] : []);
            }, n.split("/")).filter(function(e) {
                return !!e;
            }).join("/").replace(":/", "://");
        };
        var w = function(e) {
            var r = new XMLHttpRequest();
            r.open("GET", e, false);
            r.setRequestHeader("Content-Type", "text/plain");
            r.send();
            return r.status === 200 ? r.responseText : undefined;
        };
        var v = function(e, r, n) {
            var t = {
                exports: {}
            };
            var i = f(r);
            var o = e.bind(window, false, i);
            new Function("exports", "require", "module", "__filename", "__dirname", n).call(window, t.exports, o, t, r, i);
            return t.exports;
        };
        var p = function(e, r, n) {
            var t = l(n.split(".").pop());
            var i = (c(document.querySelectorAll("script")) || {}).src;
            var o = e && i ? f(i).split("/").reverse().slice(1).reverse().join("/") : r;
            var u = window.location.origin + "/" + d(n, o);
            try {
                var a = w(u);
                if (a === undefined) {
                    return undefined;
                }
                switch (t) {
                  case "executable":
                    return v(p, u, a);

                  case "object":
                    return JSON.parse(a);

                  case "style":
                    document.head.appendChild(s("style", "innerHTML", a));
                    return a;

                  default:
                    return a;
                }
            } catch (e) {
                console.error(e);
                return undefined;
            }
        };
        window.require = p.bind(window, true, f(window.location.href.indexOf("/") === window.location.href.length - 1 ? window.location.href.slice(0, window.location.href.length - 1) : window.location.href));
    }
})(typeof window == "undefined" ? window = {} : window);