const gulp = require('gulp');
const connect = require('gulp-connect');
const config = require('./../config');
const history = require('connect-history-api-fallback');

gulp.task('livereload', function () {
  const cached = require('gulp-cached');

  return gulp
    .src(config.connect.globs)
    .pipe(cached('livereload', { optimizeMemory: true }))
    .pipe(connect.reload());
});

gulp.task('connect:open', function () {
  const opn = require('opn');
  return opn(`http://${config.connect.host}:${config.connect.port}`);
});

gulp.task('connect', function () {
  connect.server({
    root: [
      config.global.dev,
      config.global.src
    ],
    port: config.connect.port,
    host: config.connect.host,
    middleware: function (connect, opt) {
      return [
        function (req, res, next) {
          if (req.method.toUpperCase() === 'POST') {
            req.method = 'GET';
          }
          return next();
        },
        history({
          index: config.connect.historyFallbackIndex
        })
      ];
    },
    livereload: config.livereload
  });
});
