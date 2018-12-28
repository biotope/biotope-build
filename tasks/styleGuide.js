const gulp = require('gulp');
const config = require('./../config');

gulp.task('styleGuide', function () {
  if (config.global.tasks.styleGuide) {
    const styleGuide = require('@biotope/styleguide/src/index');
    styleGuide(config);
  }
});