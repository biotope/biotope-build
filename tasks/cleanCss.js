const gulp = require('gulp');
const config = require('./../config');

const cleanCssTask = (source, target) => {
  const size = require('gulp-size');
  const cleanCss = require('gulp-clean-css');

  if (config.global.tasks.cleanCss) {
    return gulp
      .src(source)
      .pipe(cleanCss(config.cleanCss))
      .pipe(
        size({
          title: 'minified',
          showFiles: true
        })
      )
      .pipe(gulp.dest(target));
  } else {
    const colors = require('colors/safe');
    console.log(colors.yellow('cleanCss disabled'));
  }
};

gulp.task('cleanCss:resources:dist', function() {
  return cleanCssTask(
    path.join(
      config.global.cwd,
      config.global.dist,
      config.global.resources,
      'css',
      '**',
      '*.css'
    ),
    path.join(
      config.global.cwd,
      config.global.dist,
      config.global.resources,
      'css'
    )
  );
});

gulp.task('cleanCss:components:dist', function() {
  return cleanCssTask(
    path.join(
      config.global.cwd,
      config.global.dist,
      config.global.resources,
      config.global.components,
      '**',
      '*.css'
    ),
    path.join(
      config.global.cwd,
      config.global.dist,
      config.global.resources,
      config.global.components
    )
  );
});
