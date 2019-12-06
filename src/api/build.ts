import {
  rollup as runRollup,
  watch as runWatch,
  RollupOptions,
  OutputOptions,
} from 'rollup';
import {
  Options, RollupEvent, ParsedOptions, PluginRowSimpleAfter, PluginRowSimpleBefore,
} from './common/types';
import { cleanFolder } from './common/clean-folder';
import { createAllBuilds } from './common/rollup';
import { parseOptions, getPlugins } from './common/parsers';

const watch = (options: ParsedOptions, builds: RollupOptions[]): void => {
  const plugins = getPlugins(options.plugins, 'after-build') as PluginRowSimpleAfter[];

  const eventEmitter = runWatch(builds);

  eventEmitter.addListener('event', (event: RollupEvent) => plugins.forEach(([, plugin]) => plugin(event)));
};

const run = async (options: ParsedOptions, builds: RollupOptions[]): Promise<void> => {
  const plugins = getPlugins(options.plugins, 'after-build') as PluginRowSimpleAfter[];

  const outputBuilds = await Promise.all(builds.map(async (build) => {
    const result = await runRollup(build);
    return result.write(build.output as OutputOptions);
  }));

  plugins.forEach(([, plugin]) => plugin(outputBuilds));
};

export const build = async (options: Partial<Options>): Promise<void> => {
  const parsedOptions = parseOptions(options);
  const builds = createAllBuilds(parsedOptions);
  cleanFolder(parsedOptions.output);

  await Promise.all((getPlugins(parsedOptions.plugins, 'before-build') as PluginRowSimpleBefore[])
    .map(([, plugin]) => {
      const result = plugin(parsedOptions, builds);
      if (result && result.then && typeof result.then === 'function') {
        return new Promise((resolve) => result.then(() => resolve()));
      }
      return result as Promise<void>;
    }));

  (!parsedOptions.watch ? run : watch)(parsedOptions, builds);
};
