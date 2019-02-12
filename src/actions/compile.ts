import * as tsconfigBase from '../../tsconfig.base.json';
import { Action } from './types';
import {
  tsc,
  compilerCallback,
  getCompiler,
  CompileOptions,
} from './compilation';

const configFiles = [
  '.babelrc.ts',
  'biotope-build.config.ts',
  'postcss.config.ts',
];

const compile = (options: CompileOptions): void => {
  tsc(configFiles, tsconfigBase);

  if (!options.watch) {
    getCompiler(options).run(compilerCallback());
  } else {
    // eslint-disable-next-line no-console
    console.log('@biotope/build is watching the files…\n');
    getCompiler(options).watch({}, compilerCallback(true, options.spa));
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const registerCompile: Action = program => program
  .command('compile')
  .option('-c, --config <file>', 'An extention configuration file')
  .option('-e, --environment <file>', 'The requested environment')
  .option('-w, --watch', 'Watches files and recompiles them')
  .option('-s, --spa', 'Single-page application when watching (must contain an index.html file in root)')
  .action(compile);
