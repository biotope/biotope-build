import { src, dest } from 'gulp';
import * as connect from 'gulp-connect';

const moveFilesTo = (folder: string): any => (globs: string[] | string) => src(globs)
  .pipe(dest(folder))
  .pipe(connect.reload());

export default moveFilesTo;
