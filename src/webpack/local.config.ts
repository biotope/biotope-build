import { Configuration } from 'webpack';
import * as ExtendedDefinePlugin from 'extended-define-webpack-plugin';
import * as LiveReloadPlugin from 'webpack-livereload-plugin';
import * as mergeDeep from 'merge-deep';

import { Options } from './settings';
import { baseConfig } from './base.config';

export const config = (options: Options): Configuration => {
  const [configuration, settings] = baseConfig(options);
  return settings.overrides(mergeDeep(configuration, {
    plugins: [
      new ExtendedDefinePlugin(
        settings.runtime,
      ),
      new LiveReloadPlugin({
        appendScriptTag: true,
      }),
    ],
  }), 'local');
};
