const gulp = require('gulp');
const config = require('./../config');
const Handlebars = require('handlebars');
const hbsHelper = require('./../lib/hb2-helpers');

gulp.task('styleGuide', function () {
  if (config.global.tasks.styleGuide) {
    const styleGuide = require('@biotope/styleguide/src/index');
    styleGuide(config, Handlebars, hbsHelper);
  }
});