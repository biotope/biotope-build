const gulp = require('gulp');
const config = require('./../config');
const path = require('path');

gulp.task('svgSprite', callback => {
  const svgSprite = require('gulp-svg-sprite');

  if (config.global.tasks.svgSprite) {
    return gulp.src(path.join(config.global.src, config.global.resources, 'icons', '*.svg'))
      .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: path.join('..', 'sprite.symbol.svg')
          }
        }
      }))
      .pipe(gulp.dest(path.join(config.global.dev, config.global.resources, 'svg')));
  } else {
    const colors = require('colors/safe');
    console.log(colors.yellow('svgSprite disabled'));

    callback();
  }
});
