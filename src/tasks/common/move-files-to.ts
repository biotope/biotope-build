import { src, dest } from 'gulp';
import { reload } from 'gulp-connect';

import { GulpPipeReturn } from '../../types';

type MoveFiles = (_: string[] | string) => void;

export const moveFilesTo = (folder: string): MoveFiles => (
  globs: string[] | string,
): GulpPipeReturn => src(globs)
  .pipe(dest(folder))
  .pipe(reload());
