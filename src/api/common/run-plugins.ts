import { Plugin, PluginHook } from './types';

const flatten = (plugins: Plugin[]): Plugin[] => plugins
  .reduce((accumulator, plugin) => ([
    ...accumulator,
    ...(Array.isArray(plugin) ? flatten(plugin) : [plugin]),
  ]), []);

const filterPlugins = (plugins: Plugin[], hook: PluginHook): Plugin[] => plugins
  .filter((plugin) => plugin.hook === hook || !plugin.hook)
  .sort((left, right) => {
    const leftPriority = left.priority || 0;
    const rightPriority = right.priority || 0;
    if (leftPriority > rightPriority) {
      return -1;
    }
    if (leftPriority < rightPriority) {
      return 1;
    }
    return 0;
  });

const groupPluginsByPriority = (plugins: Plugin[]): Plugin[][] => {
  const grouped = plugins.reduce((accumulator, plugin) => ({
    ...accumulator,
    [`${plugin.priority || 0}`]: [
      ...(accumulator[`${plugin.priority || 0}`] || []),
      plugin,
    ],
  }), {} as Record<string, Plugin[]>);

  return Object.keys(grouped).sort((left, right) => {
    const leftPriority = parseFloat(left);
    const rightPriority = parseFloat(right);
    if (leftPriority > rightPriority) {
      return -1;
    }
    if (leftPriority < rightPriority) {
      return 1;
    }
    return 0;
  }).map((priority) => grouped[priority]);
};

const logPluginExecutionError = (pluginName: string | undefined, error: Error | string): void => {
  // eslint-disable-next-line no-console
  console.log(`Plugin "${pluginName}" threw an error.`);
  // eslint-disable-next-line no-console
  console.error(error);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const runPlugin = async (plugin: Plugin | Function, ...args: any[]): Promise<void> => {
  const { name, runner }: Plugin = typeof plugin !== 'function' ? plugin : { name: plugin.name, runner: plugin };

  try {
    return Promise.resolve(runner(...args))
      .catch((error) => logPluginExecutionError(name, error))
      .then(() => {});
  } catch (error) {
    logPluginExecutionError(name, error);
    return Promise.resolve();
  }
};

export const runPlugins = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: Plugin[], hook: PluginHook, ...args: any[]
): Promise<void> => {
  const grouped = groupPluginsByPriority(filterPlugins(flatten(plugins), hook));

  for (let index = 0; index < grouped.length; index += 1) {
    const group = grouped[index];
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(group.map((plugin) => runPlugin(plugin, ...args)));
  }
};
