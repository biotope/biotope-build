import { resolve } from 'path';
import { Configuration } from 'webpack';
import * as mergeDeep from 'merge-deep';

import { environments } from './environments';
import {
  Options, Settings, EntryPoint, ExternalFile,
} from './types';
import { getPaths } from './paths';
import { getRules } from './rules';
import { getRuntime } from './runtime';
import { getCoreBundleName } from './core-bundle-name';
import { defaultOptions } from './defaults';

const popLast = (array: string[]): string[] => array.reverse().splice(1).reverse();

export const getSettings = (options: Options): Settings => {
  const environment = options.environment || environments.default;
  const minify = environment === 'local' ? !!options.minify : true;

  const paths = getPaths(options.paths);
  const runtime = getRuntime(options.runtime || {}, environment, paths);
  const serverRuntimeKey = (options.paths || {}).serverPrefixRuntimeKey;
  paths.server = serverRuntimeKey ? runtime[serverRuntimeKey] : paths.server;

  const compilation = options.compilation || {};
  const style: { global: boolean; extract: boolean; prefix: string } = {
    global: false,
    extract: false,
    prefix: '',
    ...(compilation.style || {}),
  };
  const entryPoints: IndexObject<EntryPoint> = (compilation.entryPoints || ['index.ts'])
    .reduce((accumulator, file): IndexObject<EntryPoint> => ({
      ...accumulator,
      [popLast(file.split('.')).join('.')]: { file },
    }), {});

  const settings: Settings = {
    environment,
    minify,
    overrides: options.overrides || ((c): Configuration => c),
    paths,
    runtime,
    compilation: {
      alias: compilation.alias || {},
      chunks: [
        {
          test: /node_modules/,
          name: getCoreBundleName(),
          enforce: true,
          priority: 100,
          chunks: 'all',
          minChunks: 1,
        },
        ...(compilation.chunks || []),
      ],
      cleanExclusions: compilation.cleanExclusions || [],
      entryPoints,
      extensions: compilation.extensions || defaultOptions.compilation.extensions,
      externalFiles: (compilation.externalFiles || [{
        from: `${paths.appAbsolute}/resources`,
        to: 'resources',
        ignore: ['*.md'],
      }]).map((files): string | ExternalFile => (typeof files === 'string' ? resolve(files) : ({
        ...files,
        from: resolve(files.from),
      }))),
      extractStyle: style.extract,
      htmlTemplate: compilation.htmlTemplate || './resources/index.html',
      output: mergeDeep({
        script: '[name].js',
        style: '[name].css',
      }, compilation.output || {}),
      rules: getRules(
        minify,
        style.global,
        style.extract,
        style.prefix,
        compilation.compileExclusions || [],
        runtime,
      ),
    },
  };

  return settings;
};
