const gulp = require('gulp');
const config = require('./../config');

gulp.task('useref', function() {
  const useref = require('gulp-useref');
  const lec = require('gulp-line-ending-corrector');
  const filter = require('gulp-filter');

  return gulp
    .src(config.global.dev + '/*.html')
    .pipe(lec(config.lec))
    .pipe(
      useref({
        noAssets: true
      })
    )
    .pipe(filter(['**/*.html']))
    .pipe(gulp.dest(config.global.dist));
});

/**
 * ToDo: Refactor useref:assets to NOT use hbsParser.createHbsGulpStream
 * This function should be removed completely, it is too heavy implemented for its usage in this task.
 * */

gulp.task('useref:assets', function() {
  const hb = require('gulp-hb');
  const filter = require('gulp-filter');
  const useref = require('gulp-useref');
  const lec = require('gulp-line-ending-corrector');
  const uglify = require('gulp-uglify');
  const cleanCss = require('gulp-clean-css');
  const path = require('path');
  const bioHelpers = require('./../lib/hb2-helpers');

  const jsFilter = filter(['**/*.js'], { restore: true });
  const cssFilter = filter(['**/*.css'], { restore: true });

  const hbStream = hb({ debug: config.global.debug })
    .helpers(bioHelpers)
    .partials([
      path.join(config.global.cwd, config.global.src, '**', '*.hbs'),
      '!' + path.join(config.global.cwd, config.global.src, 'pages', '**')
    ]);

  return gulp
    .src([
      path.join(
        config.global.cwd,
        config.global.src,
        'resources',
        '_useref.html'
      ),
      path.join(
        config.global.cwd,
        config.global.src,
        'resources',
        '_useref.hbs'
      )
    ])
    .pipe(lec(config.lec))
    .pipe(hbStream)
    .pipe(useref())

    .pipe(jsFilter)
    .pipe(uglify(config.uglify.options))
    .pipe(jsFilter.restore)

    .pipe(cssFilter)
    .pipe(cleanCss(config.cleanCss))
    .pipe(cssFilter.restore)

    .pipe(filter(['**', '!**/_useref.html', '!**/_useref.hbs']))

    .pipe(gulp.dest(config.global.dist));
});
