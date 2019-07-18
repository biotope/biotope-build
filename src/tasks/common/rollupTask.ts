import { rollup } from 'rollup';

import { BuildConfig } from './config';
import rollupConfig from './rollup-config';

const rock = async config => {
  rollup(config).catch(console.log);

  return (await rollup(config)).write(config.output);
};

const rollupTask = (config: BuildConfig) => Promise.all(rollupConfig(config).map(rock));

export default rollupTask;
