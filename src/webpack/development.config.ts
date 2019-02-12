import { Configuration } from 'webpack';
import * as ExtendedDefinePlugin from 'extended-define-webpack-plugin';
import * as PrerenderSpaPlugin from 'prerender-spa-plugin';
import * as mergeDeep from 'merge-deep';

import { Options } from './settings';
import { baseConfig, ifPlugin } from './base.config';

export const config = (options: Options): Configuration => {
  const [configuration, settings] = baseConfig(options);
  return settings.overrides(mergeDeep(configuration, {
    plugins: [
      ...ifPlugin(settings, 'extended-define-webpack-plugin', new ExtendedDefinePlugin(
        settings.runtime,
      )),
      ...ifPlugin(settings, 'prerender-spa-plugin', new PrerenderSpaPlugin(
        settings.webpack.rendering,
      )),
    ],
  }));
};
