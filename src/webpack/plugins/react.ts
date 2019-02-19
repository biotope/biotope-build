import { RuleSetLoader } from 'webpack';

import { BiotopeBuildPlugin, Settings } from '../settings/types';

export const react: BiotopeBuildPlugin = (settings: Settings): Settings => {
  settings.compilation.rules.forEach((rules) => {
    const use = rules.use as (RuleSetLoader | RuleSetLoader[]);

    if (use) {
      const loaders: RuleSetLoader[] = [];
      if (Array.isArray(use)) {
        use.forEach(loader => loaders.push(loader));
      } else if (use.loader) {
        loaders.push(use);
      }

      loaders.forEach((loader) => {
        if (loader.loader === 'babel-loader') {
          (loader.options as IndexObjectAny).presets.push('@babel/react');
        }
      });
    }
  });
  return settings;
};
