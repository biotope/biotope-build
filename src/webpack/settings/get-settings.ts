import { resolve } from 'path';
import * as mergeDeep from 'merge-deep';
import { PuppeteerRenderer as Renderer } from 'prerender-spa-plugin';

import { environments } from './environments';
import {
  Options,
  Settings,
  EntryPointOption,
  EntryPointOptionAll,
} from './types';
import { getFavicons } from './favicons';
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
  const webpack = options.webpack || {};
  const entryPoints: EntryPointOptionAll = webpack.entryPoints || {
    index: 'index.ts',
  };

  return {
    app: {
      title: 'Biotope Boilerplate v7',
      description: 'Modern HTML5 UI Framework',
      author: 'Biotope',
      ...app,
      keywords: (app.keywords || defaultKeywords).join(','),
      ...(minify ? {
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          quoteCharacter: '"',
          removeComments: true,
        },
      } : {}),
    },
    environment,
    minify,
    overrides: options.overrides || (s => s),
    paths,
    runtime,
    webpack: {
      alias: webpack.alias || {},
      chunks: webpack.chunks || [
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
      cleanExclusions: webpack.cleanExclusions || [],
      disablePlugins: webpack.disablePlugins || [],
      entryPoints: Object.keys(entryPoints).reduce((accumulator, key) => ({
        ...accumulator,
        [key]: getEntryPoints(typeof entryPoints[key] === 'string'
          ? { file: entryPoints[key] as string }
          : entryPoints[key] as EntryPointOption, paths),
      }), {}),
      extensions: webpack.extensions || ['.ts', '.js', '.scss'],
      externalFiles: (webpack.externalFiles || [{
        from: `${paths.appAbsolute}/resources`,
        to: 'resources',
        ignore: ['*.md'],
      }]).map(files => (typeof files === 'string' ? resolve(files) : ({
        ...files,
        from: resolve(files.from),
      }))),
      favicons: getFavicons(options.webpack, paths, minify),
      output: mergeDeep({
        script: '[name].js',
        style: '[name].css',
      }, webpack.output || {}) as { script: string; style: string },
      rendering: {
        staticDir: paths.distAbsolute,
        routes: (options.webpack || {}).renderRoutes || ['/'],
        server: { port: 7999 },
        renderer: new Renderer({
          args: ['–no-sandbox', '–disable-setuid-sandbox'],
        }),
      },
      rules: getRules(
        minify,
        webpack.globalStyles || false,
        webpack.disablePlugins || [],
        webpack.compileExclusions || [],
        runtime,
      ),
    },
  };
};
