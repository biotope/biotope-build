import { Configuration } from 'webpack';
import * as ExtendedDefinePlugin from 'extended-define-webpack-plugin';
import * as LiveReloadPlugin from 'webpack-livereload-plugin';
import * as mergeDeep from 'merge-deep';

import { freePorts } from '../free-ports';
import { Options, WebpackConfig } from './settings';
import { baseConfig } from './base.config';

export const config: WebpackConfig = (options: Options): Configuration => {
  const [configuration, settings] = baseConfig(options);
  return settings.overrides(mergeDeep(configuration, {
    plugins: [
      new ExtendedDefinePlugin(
        settings.runtime,
      ),
      new LiveReloadPlugin({
        appendScriptTag: true,
        port: freePorts([35729])[0] || 35729,
      }),
    ],
  }), 'local');
};
