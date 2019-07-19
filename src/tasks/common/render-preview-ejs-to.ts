import { src, dest } from 'gulp';
import * as rename from 'gulp-rename';
import * as ejs from 'gulp-ejs';

const previewPath = '/../../devPreview/';

export const renderPreviewEjsTo = (folder: string) => (templatePath: string) => src(templatePath)
  .pipe(ejs({}, { root: `${__dirname}${previewPath}` }))
  .pipe(rename(path => path.extname = '.html'))
  .pipe(dest(folder));
