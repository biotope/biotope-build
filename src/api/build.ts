import {
  rollup as runRollup,
  watch as runWatch,
  RollupOptions,
  OutputOptions,
} from 'rollup';
import { Options, RollupEvent, ParsedOptions } from './common/types';
import { cleanFolder } from './common/clean-folder';
import { createAllBuilds } from './common/rollup';
import { parseOptions, getPlugins } from './common/parsers';

const watch = (options: ParsedOptions, builds: RollupOptions[]): void => {
  const plugins = getPlugins(options.plugins, 'after-build');

  const eventEmitter = runWatch(builds);

  eventEmitter.addListener('event', (...data: RollupEvent[]) => plugins.forEach(([, plugin]) => plugin(...data)));
};

const run = async (options: ParsedOptions, builds: RollupOptions[]): Promise<void> => {
  const plugins = getPlugins(options.plugins, 'after-build');

  const outputBuilds = await Promise.all(builds.map(async (build) => {
    const result = await runRollup(build);
    return result.write(build.output as OutputOptions);
  }));

  plugins.forEach(([, plugin]) => plugin(outputBuilds));
};

export const build = async (options: Partial<Options>): Promise<void> => {
  const parsedOptions = parseOptions(options);

  cleanFolder(parsedOptions.output);

  const builds = createAllBuilds(parsedOptions);

  getPlugins(parsedOptions.plugins, 'before-build').forEach(([, plugin]) => plugin(parsedOptions, builds));

  (!parsedOptions.watch ? run : watch)(parsedOptions, builds);
};
