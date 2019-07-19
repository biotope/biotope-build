import { src, dest } from 'gulp';
import { reload } from 'gulp-connect';

export const moveFilesTo = (folder: string): any => (globs: string[] | string) => src(globs)
  .pipe(dest(folder))
  .pipe(reload());
