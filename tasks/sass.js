const gulp = require('gulp');
const config = require('./../config');
const path = require('path');

const componentsFolderName = config.global.components.slice(1);
const resourcesFolderName = config.global.resources.slice(1);
const scssResourcesFolderName = path.join(resourcesFolderName, 'scss');

const ignoreConfig = config.sass.excludePaths.map(
  ignorePattern =>
    `!${path.join(config.global.cwd, config.global.src, ignorePattern)}`
);

gulp.task('sass', function () {
  if (config.global.tasks.sass) {
    const sass = require('gulp-sass');
    const postcss = require('gulp-postcss');
    const autoprefixer = require('autoprefixer');
    const sourcemaps = require('gulp-sourcemaps');
    const cached = require('gulp-cached');
    const dependents = require('gulp-dependents');
    const rename = require('gulp-rename');

    return gulp
      .src([
        config.global.src + '/**/*.s+(a|c)ss',
        ...ignoreConfig
      ])
      .pipe(cached('resourcesSass'))
      .pipe(dependents())
      .pipe(sourcemaps.init())
      .pipe(sass(config.sass).on('error', sass.logError))
      .pipe(postcss([autoprefixer(config.autoprefixer)]))
      .pipe(sourcemaps.write('.'))
      .pipe(rename(function (currentFile) {
        if (currentFile.dirname.indexOf(componentsFolderName) === 0) {
          currentFile.dirname = path.join(config.global.resources, currentFile.dirname);
        }
        if (currentFile.dirname.indexOf(resourcesFolderName) === 0) {
          currentFile.dirname = path.join(config.global.resources, 'css', currentFile.dirname.replace(scssResourcesFolderName, ''));
        }
      }))
      .pipe(gulp.dest(config.global.dev));
  } else {
    const colors = require('colors/safe');
    console.log(colors.yellow('sass resources disabled'));
  }
});

gulp.task('watch:sass', function () {
  if (config.global.tasks.sass) {
    const watch = require('gulp-watch');
    const runSequence = require('run-sequence');

    watch(
      [config.global.src + '/**/*.s+(a|c)ss'],
      config.watch,
      function () {
        runSequence(
          ['sass'],
          ['livereload']
        );
      }
    );

    watch(
      [config.global.src + '../.iconfont' + '/*.scss'],
      config.watch,
      function () {
        runSequence(
          ['sass'],
          ['livereload']
        );
      }
    );
  }
});
