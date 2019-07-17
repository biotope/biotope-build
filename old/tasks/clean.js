const gulp = require('gulp');
const config = require('./../config');
const path = require('path');

gulp.task('clean:dev', function(cb) {
  const del = require('del');
  del.sync([config.global.dev + '/**/*']);

  cb();
});

gulp.task('clean:dist', function(cb) {
  const del = require('del');
  del.sync([config.global.dist + '/**/*']);

  cb();
});

gulp.task('clean:useref', function(cb) {
  const del = require('del');
  del.sync([
    config.global.dist + '/_useref.html',
    config.global.dist + '/_useref.hbs'
  ]);

  cb();
});

gulp.task('clean:iconfont', function(cb) {
  const del = require('del');
  del.sync(['./iconfont']);

  cb();
});

gulp.task('clean:svgSprite', function (ob) {
  const del = require('del');
  del.sync([path.join(config.global.dev, 'resources', 'svg')]);

  ob();
});
