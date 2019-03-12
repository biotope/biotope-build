import { Action } from './types';
import { serve } from './compilation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const registerServe: Action = program => program
  .command('serve')
  .option('-d, --directory', 'Directory in which to serve')
  .option('-p, --port <number>', 'Specify a port')
  .option('-o, --open', 'Open the web-page on the default browser')
  .option('-z, --production', 'Serve with https and gzip')
  .option('-s, --spa', 'Single-page application (must contain an index.html file in root)')
  .action(serve);
