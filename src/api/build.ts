import { rollup as runRollup, watch as runWatch, OutputOptions } from 'rollup';
import { cleanFolder } from './common/clean-folder';
import { createPreBuilds, finalizeBuilds } from './common/rollup';
import { parseOptions } from './common/parsers';
import { createAsyncQueue } from './common/async-queue';
import { runPlugins } from './common/run-plugins';
import { emit } from './common/emit';
import {
  Options, ParsedOptions, PostBuild, Build,
} from './common/types';

enum WatchState {
  STOPPED,
  BUILDING,
  WAITING,
}

let buildHasErrors = false;
let watchState = WatchState.STOPPED;
let fullRebuild = false;

const handleKeypress = (data: Buffer): void => {
  if (watchState === WatchState.WAITING && data.indexOf('\n') >= 0) {
    fullRebuild = true;
  }
};

const watch = (options: ParsedOptions, builds: PostBuild[]): Promise<void> => {
  watchState = WatchState.BUILDING;
  const { push } = createAsyncQueue();

  const runner = runWatch(builds.map(({ build }) => build));
  runner.addListener('event', (event) => push(async () => {
    if (event.code === 'END') {
      await emit(options, builds);
      fullRebuild = false;
      watchState = WatchState.WAITING;
    } else {
      await runPlugins(options.plugins, 'mid-build', options, builds, event);
    }
  }));

  return new Promise((_, reject) => {
    const check = (): void => {
      if (watchState === WatchState.WAITING && fullRebuild) {
        runner.close();
        setTimeout(() => reject(), 0);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

const run = async (options: ParsedOptions, builds: PostBuild[]): Promise<void> => {
  await runPlugins(options.plugins, 'mid-build', options, builds, { code: 'START' });

  await Promise.all(builds.map(async ({ build }) => {
    try {
      const result = await runRollup(build);
      await result.write(build.output as OutputOptions);
    } catch (error) {
      buildHasErrors = true;
      await runPlugins(options.plugins, 'mid-build', options, builds, { code: 'ERROR', error });
    }
  }));

  await emit(options, builds);
};

const start = async (parsedOptions: ParsedOptions, preBuilds: Build[]): Promise<boolean> => {
  const builds = finalizeBuilds(preBuilds);
  await (!parsedOptions.watch ? run : watch)(parsedOptions, builds);

  return !buildHasErrors || parsedOptions.ignoreResult;
};

export const build = async (options: Partial<Options>): Promise<boolean> => {
  const originalEnvironment = process.env.NODE_ENV;
  process.env.NODE_ENV = options.production ? 'production' : 'development';

  let processShouldEnd = false;
  let result = false;

  if (options.watch) {
    process.stdin.on('data', handleKeypress);
  }

  const parsedOptions = parseOptions(options);
  const preBuilds = createPreBuilds(parsedOptions);
  cleanFolder(parsedOptions.output);

  await runPlugins(parsedOptions.plugins, 'before-build', parsedOptions, preBuilds);

  while (!processShouldEnd) {
    try {
      // eslint-disable-next-line no-await-in-loop
      result = await start(parsedOptions, preBuilds);
      processShouldEnd = true;
    } catch (_) {
      if (!options.watch) {
        processShouldEnd = true;
      }
      fullRebuild = false;
      watchState = WatchState.STOPPED;
    }
  }
  process.env.NODE_ENV = originalEnvironment;

  if (options.watch) {
    process.stdin.off('data', handleKeypress);
  }
  return result;
};
