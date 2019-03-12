import { Configuration } from 'webpack';
import * as ExtendedDefinePlugin from 'extended-define-webpack-plugin';
import * as mergeDeep from 'merge-deep';

import { Options, WebpackConfig } from './settings';
import { baseConfig } from './base.config';

export const config: WebpackConfig = (options: Options): Configuration => {
  const [configuration, settings] = baseConfig({
    ...options,
    minify: true,
  });
  return settings.overrides(mergeDeep(configuration, {
    devtool: false,
    mode: 'production',
    optimization: {
      minimize: true,
      noEmitOnErrors: true,
    },
    plugins: [
      new ExtendedDefinePlugin(
        settings.runtime,
      ),
    ],
  }), 'prod');
};
