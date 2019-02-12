#!/usr/bin/env node
import * as commander from 'commander';

import * as actions from './actions';

export { Options } from './webpack';

Object.keys(actions).forEach(key => (actions as actions.Actions)[key](commander));

commander.parse(process.argv);
