import { Configuration, Plugin, Options as WebpackOptions } from 'webpack';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import * as ManifestJsonWebpackPlugin from 'manifest-json-webpack-plugin';

import { Options, Settings, getSettings } from './settings';

export const ifPlugin = (settings: Settings, plugin: string, value: Plugin): Plugin[] => ([
  ...(settings.webpack.disablePlugins.indexOf(plugin) < 0 ? [value] : []),
]);

export const baseConfig = (options: Options): [Configuration, Settings] => {
  const settings = getSettings(options);

  return [{
    context: settings.paths.appAbsolute,
    devtool: 'cheap-module-source-map',
    mode: 'development',
    entry: Object.keys(settings.webpack.entryPoints).reduce((accumulator, key) => ({
      ...accumulator,
      [key]: `${settings.paths.pagesAbsolute}/${settings.webpack.entryPoints[key].file}`,
    }), {}),
    module: { rules: settings.webpack.rules },
    output: {
      path: settings.paths.buildAbsolute,
      filename: settings.webpack.output.script,
      publicPath: `${settings.paths.server}${settings.paths.buildRelative}`,
    },
    optimization: {
      minimize: false,
      splitChunks: {
        cacheGroups: settings.webpack.chunks.reduce((accumulator, value) => ({
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
        exclude: settings.webpack.cleanExclusions || [],
        verbose: false,
      })),
      ...ifPlugin(settings, 'copy-webpack-plugin', new CopyWebpackPlugin(settings.webpack
        .externalFiles.map((filesRules) => {
          const parsedRules = typeof filesRules === 'string' ? { from: filesRules } : filesRules;
          return {
            ...parsedRules,
            to: `${settings.paths.distAbsolute}/${parsedRules.to || ''}`,
            ignore: parsedRules.ignore || ['.*'],
          };
        }))),
      ...ifPlugin(settings, 'mini-css-extract-plugin', new MiniCssExtractPlugin({
        filename: settings.webpack.output.style,
      })),
      ...(settings.webpack.disablePlugins.indexOf('html-webpack-plugin') < 0
        ? Object.keys(settings.webpack.entryPoints).map(entryPoint => new HtmlWebpackPlugin({
          ...settings.app,
          chunks: [entryPoint, ...(settings.webpack.chunks.map(chunk => chunk.name) as string[])],
          filename: settings.webpack.entryPoints[entryPoint].filename,
          template: settings.webpack.entryPoints[entryPoint].template,
        })) : []),
      ...ifPlugin(settings, 'favicons-webpack-plugin', new FaviconsWebpackPlugin({
        title: settings.app.title,
        logo: settings.webpack.favicons.file,
        prefix: `${settings.webpack.favicons.output}/`,
        persistentCache: settings.webpack.favicons.cache,
        icons: settings.webpack.favicons.icons,
      })),
      ...ifPlugin(settings, 'manifest-json-webpack-plugin', new ManifestJsonWebpackPlugin({
        path: settings.paths.pagesRelative.split('/').filter(f => !!f).reduce(() => '../', ''),
        pretty: settings.minify,
        name: settings.app.title,
        description: settings.app.description,
        lang: 'en',
        icons: settings.webpack.favicons.output,
      })),
    ],
    resolve: {
      extensions: settings.webpack.extensions,
      alias: settings.webpack.alias,
      modules: [
        settings.paths.appAbsolute,
        'node_modules',
      ],
    },
  }, settings];
};
