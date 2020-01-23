import { rollup as runRollup, watch as runWatch, OutputOptions } from 'rollup';
import { writeFileSync, createFileSync } from 'fs-extra';
import { resolve } from 'path';
import { Options, ParsedOptions, PostBuild } from './common/types';
import { cleanFolder } from './common/clean-folder';
import { createPreBuilds, finalizeBuilds } from './common/rollup';
import { parseOptions } from './common/parsers';
import { createAsyncQueue } from './common/async-queue';
import { runPlugins } from './common/run-plugins';

const emit = async (options: ParsedOptions, builds: PostBuild[]): Promise<void> => {
  await runPlugins(options.plugins, 'before-emit', options, builds);

  builds.forEach(({ outputFiles }) => {
    Object.keys(outputFiles).forEach((filename) => {
      const file = resolve(`${options.output}/${filename}`);
      createFileSync(file);
      writeFileSync(file, outputFiles[filename]);
    });
  });

  await runPlugins(options.plugins, 'after-emit', options, builds);
};

const watch = (options: ParsedOptions, builds: PostBuild[]): void => {
  const { push } = createAsyncQueue();

  runWatch(builds.map(({ build }) => build)).addListener('event', (event) => push(async () => {
    if (event.code === 'END') {
      await emit(options, builds);
    } else {
      await runPlugins(options.plugins, 'mid-build', options, builds, event);
    }
  }));
};

const run = async (options: ParsedOptions, builds: PostBuild[]): Promise<void> => {
  await runPlugins(options.plugins, 'mid-build', options, builds, { code: 'START' });

  await Promise.all(builds.map(async ({ build }) => {
    try {
      const result = await runRollup(build);
      await result.write(build.output as OutputOptions);
    } catch (error) {
      await runPlugins(options.plugins, 'mid-build', options, builds, { code: 'ERROR', error });
    }
  }));

  await emit(options, builds);
};

export const build = async (options: Partial<Options>): Promise<void> => {
  const parsedOptions = parseOptions(options);
  const preBuilds = createPreBuilds(parsedOptions);
  cleanFolder(parsedOptions.output);

  await runPlugins(parsedOptions.plugins, 'before-build', parsedOptions, preBuilds);

  const builds = finalizeBuilds(preBuilds);
  await (!parsedOptions.watch ? run : watch)(parsedOptions, builds);
};
