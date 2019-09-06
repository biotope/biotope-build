import { rollup, rollupWatch } from './common';

export const bundle = async (config, watch: boolean = false) => {
  if(watch) {
    return await rollupWatch(config)
  }
  return await rollup(config);
}