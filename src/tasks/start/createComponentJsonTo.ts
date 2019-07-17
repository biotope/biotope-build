import { src, dest } from 'gulp';
import * as fileList from 'gulp-filelist';

const createComponentJsonTo = (folder: string) => () => src('src/components/**/*.html').pipe(fileList('components.json')).pipe(dest(folder));

export default createComponentJsonTo;