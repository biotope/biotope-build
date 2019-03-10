import { getConfigFile } from '../config-file';
import { Action } from './types';
import {
  compilerCallback,
  getCompiler,
  CompileOptions,
} from './compilation';

const compilation = (options: CompileOptions): void => {
  const compiler = getCompiler({
    ...options,
    config: getConfigFile(options.config, options.additionalCompilation),
  });

  if (!options.watch) {
    compiler.run(compilerCallback());
  } else {
    // eslint-disable-next-line no-console
    console.log('@biotope/build is watching the files…\n');
    compiler.watch({}, compilerCallback(!!options.open, !!options.spa));
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const registerCompile: Action = program => program
  .command('compile')
  .option('-c, --config <file>', 'Specify a configuration file (ts or js)')
  .option('-a, --additional-compilation <pattern>', 'Specify a pattern of files to be compiled before running')
  .option('-e, --environment <name>', 'Specify the environment name (local, dev or prod)')
  .option('-w, --watch', 'Watch files and recompile them')
  .option('-o, --open', 'Serve and open files (requires --watch)')
  .option('-s, --spa', 'Single-page application when watching (must contain an index.html file in root)')
  .action(compilation);
