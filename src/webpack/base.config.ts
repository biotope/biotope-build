import { Configuration, Plugin, Options as WebpackOptions } from 'webpack';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import * as ManifestJsonWebpackPlugin from 'manifest-json-webpack-plugin';

import { Options, Settings, getSettings } from './settings';

export const ifPlugin = (settings: Settings, plugin: string, value: Plugin): Plugin[] => ([
  ...(settings.compilation.disablePlugins.indexOf(plugin) < 0 ? [value] : []),
]);

export const baseConfig = (options: Options): [Configuration, Settings] => {
  const settings = getSettings(options);

  return [{
    context: settings.paths.appAbsolute,
    devtool: 'cheap-module-source-map',
    mode: 'development',
    entry: Object.keys(settings.compilation.entryPoints).reduce((accumulator, key) => ({
      ...accumulator,
      [key]: `${settings.paths.pagesAbsolute}/${settings.compilation.entryPoints[key].file}`,
    }), {}),
    module: { rules: settings.compilation.rules },
    output: {
      path: settings.paths.buildAbsolute,
      filename: settings.compilation.output.script,
      publicPath: `${settings.paths.server}${settings.paths.buildRelative}`,
    },
    optimization: {
      minimize: false,
      splitChunks: {
        cacheGroups: settings.compilation.chunks.reduce((accumulator, value) => ({
          ...accumulator,
          [value.name as string]: value,
        }), {
          default: false,
          vendors: false,
        }) as { [key: string]: WebpackOptions.CacheGroupsOptions },
      },
    },
    plugins: [
      ...ifPlugin(settings, 'clean-webpack-plugin', new CleanWebpackPlugin(settings.paths.dist, {
        root: settings.paths.baseAbsolute,
        exclude: settings.compilation.cleanExclusions || [],
        verbose: false,
      })),
      ...ifPlugin(settings, 'copy-webpack-plugin', new CopyWebpackPlugin(settings.compilation
        .externalFiles.map((filesRules) => {
          const parsedRules = typeof filesRules === 'string' ? { from: filesRules } : filesRules;
          return {
            ...parsedRules,
            to: `${settings.paths.distAbsolute}/${parsedRules.to || ''}`,
            ignore: parsedRules.ignore || ['.*'],
          };
        }))),
      ...ifPlugin(settings, 'mini-css-extract-plugin', new MiniCssExtractPlugin({
        filename: settings.compilation.output.style,
      })),
      ...(settings.compilation.disablePlugins.indexOf('html-webpack-plugin') < 0
        ? Object.keys(settings.compilation.entryPoints).map(entryPoint => new HtmlWebpackPlugin({
          ...settings.app,
          chunks: [
            entryPoint,
            ...(settings.compilation.chunks.map(chunk => chunk.name) as string[]),
          ],
          filename: settings.compilation.entryPoints[entryPoint].filename,
          template: settings.compilation.entryPoints[entryPoint].template,
        })) : []),
      ...ifPlugin(settings, 'favicons-webpack-plugin', new FaviconsWebpackPlugin({
        title: settings.app.title,
        logo: settings.compilation.favicons.file,
        prefix: `${settings.compilation.favicons.output}/`,
        persistentCache: settings.compilation.favicons.cache,
        icons: settings.compilation.favicons.icons,
      })),
      ...ifPlugin(settings, 'manifest-json-webpack-plugin', new ManifestJsonWebpackPlugin({
        path: settings.paths.pagesRelative.split('/').filter(f => !!f).reduce(() => '../', ''),
        pretty: settings.minify,
        name: settings.app.title,
        description: settings.app.description,
        lang: 'en',
        icons: settings.compilation.favicons.output,
      })),
    ],
    resolve: {
      extensions: settings.compilation.extensions,
      alias: settings.compilation.alias,
      modules: [
        settings.paths.appAbsolute,
        'node_modules',
      ],
    },
  }, settings];
};
