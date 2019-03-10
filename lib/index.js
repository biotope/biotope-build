#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var actions = require("./actions");
var webpack_1 = require("./webpack");
exports.defaultOptions = webpack_1.defaultOptions;
Object.keys(actions).forEach(function (key) { return actions[key](commander); });
commander.parse(process.argv);
