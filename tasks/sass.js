const gulp = require('gulp');
const config = require('./../config');
const path = require('path');

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
        config.global.src + config.global.resources + '/**/*.s+(a|c)ss'
      ])
      .pipe(cached('resourcesSass'))
      .pipe(dependents())
      .pipe(sourcemaps.init())
      .pipe(sass(config.sass).on('error', sass.logError))
      .pipe(postcss([autoprefixer(config.autoprefixer)]))
      .pipe(sourcemaps.write('.'))
      .pipe(rename(function (currentFile) {
        currentFile.dirname = path.join(config.global.resources, currentFile.dirname.replace('scss', 'css'));
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
