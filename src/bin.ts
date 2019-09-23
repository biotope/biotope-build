#!/usr/bin/env node

import { createBuild } from './index';
import * as commander from 'commander';


commander
.option('-d, --debug', 'output extra debugging')
.option('-w, --watch', 'watch file changes')

commander.parse(process.argv);

const config = require(`${process.cwd()}/biotope-build.config.js`);
console.log(config);

const build = createBuild(config, commander.watch)
build();