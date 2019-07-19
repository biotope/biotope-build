import { src, dest } from 'gulp';
import * as fileList from 'gulp-filelist';
import { GulpPipeReturn } from '../../types';

export const createComponentJsonTo = (folder: string): Function => (): GulpPipeReturn => src('src/components/**/*.html')
  .pipe(fileList('components.json'))
  .pipe(dest(folder));
