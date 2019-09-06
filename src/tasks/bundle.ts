import { BuildTask, BuildConfig } from './../types';
import { rollup, rollupWatch } from './common';

export const bundle: BuildTask = async (config: BuildConfig, watch: boolean = false) => {
  if(watch) {
    await rollupWatch(config)
  } else {
    await rollup(config);
  }
}