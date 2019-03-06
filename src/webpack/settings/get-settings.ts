import { resolve } from 'path';
import * as mergeDeep from 'merge-deep';

import { environments } from './environments';
import {
  Options,
  Settings,
  EntryPointOption,
  EntryPointOptionAll,
} from './types';
import { getPaths } from './paths';
import { getRules } from './rules';
import { getRuntime } from './runtime';
import { getEntryPoints } from './entry-points';

const defaultKeywords = ['biotope', 'boilerplate', 'modern', 'framework', 'html5'];

export const getSettings = (options: Options): Settings => {
  const environment = options.environment || environments.default;
  const minify = environment === 'local' ? !!options.minify : true;

  const paths = getPaths(options.paths);
  const runtime = getRuntime(options.runtime || {}, environment, paths);
  const serverRuntimeKey = (options.paths || {}).serverPrefixRuntimeKey;
  paths.server = serverRuntimeKey ? runtime[serverRuntimeKey] : paths.server;

  const app = options.app || {};
  const compilation = options.compilation || {};
  const entryPoints: EntryPointOptionAll = compilation.entryPoints || {
    index: 'index.ts',
  };

  const settings: Settings = {
    app: {
      title: 'Biotope Boilerplate v7',
      description: 'Modern HTML5 UI Framework',
      author: 'Biotope',
      ...app,
      keywords: (app.keywords || defaultKeywords).join(','),
    },
    environment,
    minify,
    overrides: options.overrides || (s => s),
    paths,
    runtime,
    compilation: {
      alias: compilation.alias || {},
      chunks: compilation.chunks || [
        {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
        {
          name: 'common',
          chunks: 'initial',
          minChunks: 2,
        },
      ],
      cleanExclusions: compilation.cleanExclusions || [],
      enablePlugins: compilation.enablePlugins || [],
      entryPoints: Object.keys(entryPoints).reduce((accumulator, key) => ({
        ...accumulator,
        [key]: getEntryPoints(typeof entryPoints[key] === 'string'
          ? { file: entryPoints[key] as string }
          : entryPoints[key] as EntryPointOption, paths),
      }), {}),
      extensions: compilation.extensions || ['.ts', '.js', '.scss'],
      externalFiles: (compilation.externalFiles || [{
        from: `${paths.appAbsolute}/resources`,
        to: 'resources',
        ignore: ['*.md'],
      }]).map(files => (typeof files === 'string' ? resolve(files) : ({
        ...files,
        from: resolve(files.from),
      }))),
      output: mergeDeep({
        script: '[name].js',
        style: '[name].css',
      }, compilation.output || {}) as { script: string; style: string },
      rules: getRules(
        minify,
        compilation.globalStyles || false,
        compilation.enablePlugins || [],
        compilation.compileExclusions || [],
        runtime,
      ),
    },
  };

  return settings;
};
