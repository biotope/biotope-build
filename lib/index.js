#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var actions = require("./actions");
Object.keys(actions).forEach(function (key) { return actions[key](commander); });
commander.parse(process.argv);
