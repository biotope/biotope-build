import { BuildConfig } from '../../types';
import { rollup, rollupWatch } from '../../common';

export default async (config: BuildConfig, isServing: boolean) => {
  if(isServing) {
    await rollupWatch(config)
  } else {
    await rollup(config);
  }
}