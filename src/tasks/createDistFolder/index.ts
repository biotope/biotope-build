import { BuildConfig } from '../../types';
import * as fs from 'fs';

export default async (config: BuildConfig) => {
  if (!fs.existsSync(config.paths.distFolder)){
    fs.mkdirSync(config.paths.distFolder);
  }
}