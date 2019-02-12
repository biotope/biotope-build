import { NodeEnvironment } from './types';

export const environments: IndexObject<NodeEnvironment> = {
  default: 'local',
  local: 'local',
  dev: 'development',
  prod: 'production',
};
