import { BuildConfig, BuildTask } from './../types';
import * as fs from 'fs';

export const createDistFolder: BuildTask = async (config: BuildConfig, watch: Function) => {
  if (!fs.existsSync(config.paths.distFolder)){
    fs.mkdirSync(config.paths.distFolder);
  }
}