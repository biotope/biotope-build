const gulp = require('gulp');
const config = require('./../config');
const colors = require('colors/safe');

gulp.task('htmlhint', function () {
  if (config.global.tasks.htmlhint) {
    const htmlhint = require('gulp-htmlhint');
    const cached = require('gulp-cached');

    return gulp
      .src(config.global.dev + '/*.html')
      .pipe(cached('htmlhint', { optimizeMemory: true }))
      .pipe(htmlhint('.htmlhintrc'))
      .pipe(htmlhint.reporter('htmlhint-stylish'));
  } else {
    console.log(colors.yellow('htmlhint disabled'));
  }
});

gulp.task('watch:html', function () {
  if (config.global.tasks.htmlhint) {
    const watch = require('gulp-watch');
    const runSequence = require('run-sequence');

    watch([config.global.dev + '/*.html'], config.watch, function () {
      runSequence('htmlhint');
    });
  } else {
    console.log(colors.yellow('htmlhint disabled'));
  }
});
