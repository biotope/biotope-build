import { src, dest, watch } from 'gulp';
import * as connect from 'gulp-connect';
import { ServeConfig } from '../config';
import * as fileList from 'gulp-filelist';

const createServeTask = (config: ServeConfig) => () => new Promise((res, rej) => {
  const del = require('del');
  del.sync(['.tmp']);
  src('src/components/**/*.html').pipe(fileList('components.json')).pipe(dest('.tmp'));
  src([`preview/*.html`, `preview/*.js`, `preview/*.css`]).pipe(dest('.tmp'));
  watch([`preview/*.html`, `preview/*.js`, `preview/*.css`])
    .on('change', (filepath) => {
        src(`${process.cwd()}/${filepath}`).pipe(dest('.tmp')).pipe(connect.reload())
      }
    )
  src([`src/**/*.html`]).pipe(dest('.tmp'));
  connect.server({    
    root: '.tmp',
    livereload: true,
    port: config.port,
  }, function () { this.server.on('close', res) })
})

export default createServeTask;