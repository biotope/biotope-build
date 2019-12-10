import {
  rollup as runRollup, watch as runWatch, RollupOptions, OutputOptions,
} from 'rollup';
import {
  Options, RollupEvent, ParsedOptions, PluginRowSimpleAfter, PluginRowSimpleBefore,
} from './common/types';
import { cleanFolder } from './common/clean-folder';
import { createAllBuilds, finalizeBuilds } from './common/rollup';
import { parseOptions, getPlugins, toThenable } from './common/parsers';

let isQueueRunning = false;
const eventQueue: (() => Promise<void[]>)[] = [];

const runEventQueue = async (): Promise<void> => {
  if (!eventQueue.length || isQueueRunning) {
    isQueueRunning = false;
    return;
  }
  isQueueRunning = true;
  await (eventQueue.pop() as Function)();
  setTimeout(runEventQueue, 0);
};

const eventListener = (plugins: PluginRowSimpleAfter[]) => (event: RollupEvent): void => {
  eventQueue.unshift(async () => Promise.all(
    plugins.map(([, plugin]) => toThenable(plugin(event))),
  ));
  runEventQueue();
};

const watch = (options: ParsedOptions, builds: RollupOptions[]): void => {
  const plugins = getPlugins(options.plugins, 'after-build') as PluginRowSimpleAfter[];

  runWatch(builds).addListener('event', eventListener(plugins));
};

const run = async (options: ParsedOptions, builds: RollupOptions[]): Promise<void> => {
  const plugins = getPlugins(options.plugins, 'after-build') as PluginRowSimpleAfter[];

  const outputBuilds = await Promise.all(builds.map(async (build) => {
    const result = await runRollup(build);
    return result.write(build.output as OutputOptions);
  }));

  await Promise.all(plugins.map(([, plugin]) => toThenable(plugin(outputBuilds))));
};

export const build = async (options: Partial<Options>): Promise<void> => {
  const parsedOptions = parseOptions(options);
  const preBuilds = createAllBuilds(parsedOptions);
  cleanFolder(parsedOptions.output);

  await Promise.all((getPlugins(parsedOptions.plugins, 'before-build') as PluginRowSimpleBefore[])
    .map(([, plugin]) => toThenable(plugin(parsedOptions, preBuilds))));

  const builds = finalizeBuilds(preBuilds);
  await (!parsedOptions.watch ? run : watch)(parsedOptions, builds);
};
