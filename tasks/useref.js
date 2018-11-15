const gulp = require('gulp');
const config = require('./../config');

gulp.task('useref', function () {
  const useref = require('gulp-useref');
  const lec = require('gulp-line-ending-corrector');

  return gulp
    .src(config.global.dev + '/*.html')
    .pipe(lec(config.lec))
    .pipe(
      useref({
        noAssets: true
      })
    )
    .pipe(gulp.dest(config.global.dist));
});

gulp.task('useref:assets', function () {
  const hb = require('gulp-hb');
  const filter = require('gulp-filter');
  const useref = require('gulp-useref');
  const lec = require('gulp-line-ending-corrector');
  const path = require('path');
  const bioHelpers = require('./../lib/hb2-helpers');

  const hbStream = hb({ debug: config.global.debug })
    .helpers(bioHelpers)
    .partials([
      path.join(
        config.global.cwd,
        config.global.src,
        '**',
        '*.hbs'
      ),
      '!' + path.join(
        config.global.cwd,
        config.global.src,
        'pages',
        '**'
      )
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
    .pipe(filter(['**', '!**/_useref.html', '!**/_useref.hbs']))
    .pipe(gulp.dest(path.join(
      config.global.cwd,
      config.global.dev
    )));
});
