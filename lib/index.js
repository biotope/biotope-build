#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const actions = require("./actions");
Object.keys(actions).forEach((key) => actions[key](commander));
commander.parse(process.argv);
