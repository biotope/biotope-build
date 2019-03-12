import { Stats } from 'webpack';

import { freePorts } from '../../free-ports';
import { serve } from './serve';

interface WebpackCompileError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

type CompilerCallback = (error: WebpackCompileError, stats: Stats) => void;

let firstTimeFinish = true;

export const compilerCallback = (
  open: boolean = false,
  spa: boolean = false,
): CompilerCallback => (error: WebpackCompileError, stats: Stats): void => {
  if (firstTimeFinish && open) {
    firstTimeFinish = false;

    const [port] = freePorts([8000]);
    serve({ open, port, spa });
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error.stack || error);
    if (error.details) {
      // eslint-disable-next-line no-console
      console.error(error.details);
    }
    process.exit(1);
  }
  if (stats.compilation) {
    if (stats.compilation.errors.length !== 0) {
      stats.compilation.errors
      // eslint-disable-next-line no-console
        .forEach(compilationError => console.error(compilationError.message));
      process.exitCode = 2;
    } else {
      // eslint-disable-next-line no-console
      console.log(stats.toString({
        colors: true,
        cached: false,
        cachedAssets: false,
      }));
    }
  }
};
