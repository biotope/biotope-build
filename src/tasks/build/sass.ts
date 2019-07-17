import { GulpTaskCreator } from '../../GulpTask';
import { SassConfig } from '../common/config';
import { src, dest } from 'gulp';
import * as sass from 'gulp-sass';
import * as nodeSass from 'node-sass';
sass.compiler = nodeSass;

import * as postcss from 'gulp-postcss';
import * as autoprefixer from 'autoprefixer';
import * as cssnano from 'cssnano';

const createStylesTask: GulpTaskCreator = (config: SassConfig) => 
  () => new Promise((res, rej) => src(`${process.cwd()}/${config.entryGlob}`)
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(postcss([autoprefixer({grid: 'autoplace'}), cssnano()]))
      .pipe(dest(`${process.cwd()}/${config.target}`))
      .on('end', res)
    )

export default createStylesTask;
