import { src, dest } from 'gulp';
import * as fileList from 'gulp-filelist';
import * as merge from 'gulp-merge-json';

const createComponentJsonTo = (folder: string) => () => {
  return src('src/components/**/*.html').pipe(fileList('components.json')).pipe(dest(folder));
}

export default createComponentJsonTo;