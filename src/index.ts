#!/usr/bin/env node
import * as commander from 'commander';

import * as actions from './actions';

export {
  Options, ExternalFile, OverrideFunction, EntryPoint, StyleOptions, defaultOptions,
} from './webpack';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
Object.keys(actions).forEach(key => (actions as actions.Actions)[key](commander));

commander.parse(process.argv);
