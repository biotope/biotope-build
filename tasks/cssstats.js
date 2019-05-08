const gulp = require('gulp');
const config = require('./../config');

gulp.task('cssstats', function() {
  const colors = require('colors/safe');

  if (config.global.tasks.cssStats) {
    const tap = require('gulp-tap');
    const cssstats = require('gulp-cssstats');

    return gulp
      .src([config.global.dist + '/resources/css/**/*.css'])
      .pipe(cssstats())
      .pipe(
        tap(function(file) {
          const stats = JSON.parse(file.contents.toString());
          const filepath = file.path.substr(0, file.path.length - 4) + 'css';

          console.log(colors.blue(`CSS Stats for ${filepath}`));
          console.log(
            colors.green(`Minified: ${(stats.size / 1024).toFixed(2)} KB`)
          );
          console.log(
            colors.green(`Gzipped: ${(stats.gzipSize / 1024).toFixed(2)} KB`)
          );

          // IE9 selector limit
          if (stats.selectors.total > 4096) {
          } else {
            console.log(colors.green(`Selectors: ${stats.selectors.total}`));
          }
        })
      );
  } else {
    console.log(colors.yellow('cssStats disabled'));
  }
});
