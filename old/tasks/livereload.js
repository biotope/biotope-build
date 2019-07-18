//browsersync.io

const gulp = require('gulp');
const connect = require('gulp-connect');
const config = require('../config');
const history = require('connect-history-api-fallback');
const cors = require('cors');

gulp.task('livereload', function () {
  const cached = require('gulp-cached');

  return gulp
    .src(config.connect.globs)
    .pipe(cached('livereload', { optimizeMemory: true }))
    .pipe(connect.reload());
});

gulp.task('connect:open', function () {
  const open = require('open');
  if (config.connect.host === '0.0.0.0') {
    return open(`http://localhost:${config.connect.port}`);
  }
  return open(`http://${config.connect.host}:${config.connect.port}`);
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
        cors(),
        history({
          index: config.connect.historyFallbackIndex
        })
      ];
    },
    livereload: config.livereload
  });
});
