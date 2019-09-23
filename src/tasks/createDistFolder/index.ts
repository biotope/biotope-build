import { BuildConfig } from '../../types';
import * as fs from 'fs-extra';

export default async (config: BuildConfig) => {
  await fs.ensureDir(config.paths.distFolder)
}