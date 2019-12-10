import { ParsedOptions, LegacyOptions } from '../types';

export const getCopyConfig = (config: ParsedOptions, requirePath?: string): object[] => ([
  [
    ...config.copy.map((folder) => ({
      files: `${config.project}/${folder}/**/*`,
      dest: `${config.output}/${folder}`,
    })),
    ...(requirePath && !(config.legacy as LegacyOptions).inline
      ? [{ files: requirePath, dest: config.output }]
      : []),
  ],
  { watch: config.watch },
]);
