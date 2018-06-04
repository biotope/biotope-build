const gulp = require('gulp');
const config = require('./../config');

gulp.task('favicons', function() {
  if (config.global.tasks.favicons) {
    const favicons = require('gulp-favicons');

    return gulp
      .src(config.global.src + '/resources/favicon.png')
      .pipe(favicons(config.favicons))
      .pipe(gulp.dest(config.global.dist + '/favicons/'));
  }
});
