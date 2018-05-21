const fs = require('fs');
const gulp = require('gulp');
const config = require('./../config');

const checkFilePaths = (arr, cb) => {
  let iconfontArray = config.iconfontCss;
  if (!Array.isArray(iconfontArray)) {
    iconfontArray = [iconfontArray];
  }
  const promises = [];
  for (const iconfont of iconfontArray) {
    const p = new Promise((res, _) => {
      fs.access(iconfont.path, fs.constants.F_OK, err => {
        if (err) {
          res({
            error: 'file does not exist',
            path: iconfont.path
          });
        } else {
          res({ error: '', path: iconfont.path });
        }
      });
    });
    promises.push(p);
  }
  Promise.all(promises).then(errors => {
    cb(errors.filter(e => e.error !== ''));
  });
};

gulp.task('iconfont', callback => {
  const runSequence = require('run-sequence');

  if (config.global.tasks.iconfont) {
    checkFilePaths(config.iconfontCss, errors => {
      if (errors.length > 0) {
        const colors = require('colors/safe');
        for (const err of errors) {
          console.log(
            colors.red(
              `🛑 Error in IconFont task: ${err.error}, ${
                err.path
              }`
            )
          );
        }
        callback();
      } else {
        runSequence(
          'convertIconsToTtf',
          ['convertTtfToEot', 'convertTtfToWoff'],
          callback
        );
      }
    });
  } else {
    const colors = require('colors/safe');
    console.log(colors.yellow('iconfont disabled'));

    callback();
  }
});

gulp.task('convertIconsToTtf', function() {
  const mergeStream = require('merge-stream');
  const iconfontCss = require('gulp-iconfont-css');
  const svgicons2svgfont = require('gulp-svgicons2svgfont');
  const svg2ttf = require('gulp-svg2ttf');

  let iconfontArray = config.iconfontCss;

  if (!Array.isArray(iconfontArray)) {
    iconfontArray = [iconfontArray];
  }

  return mergeStream(
    iconfontArray.map(function(currentIconResource) {
      return gulp
        .src(config.global.src + config.global.resources + '/icons/*.svg')
        .pipe(iconfontCss(currentIconResource))
        .pipe(svgicons2svgfont(config.iconfont))
        .pipe(svg2ttf())
        .pipe(
          gulp.dest(
            config.global.dev + config.global.resources + '/fonts/icons/'
          )
        );
    })
  );
});

gulp.task('convertTtfToEot', function() {
  const ttf2eot = require('gulp-ttf2eot');

  return gulp
    .src(config.global.dev + '/resources/fonts/icons/*.ttf')
    .pipe(ttf2eot())
    .pipe(gulp.dest(config.global.dev + '/resources/fonts/icons/'));
});

gulp.task('convertTtfToWoff', function() {
  const ttf2woff = require('gulp-ttf2woff');

  return gulp
    .src(config.global.dev + '/resources/fonts/icons/*.ttf')
    .pipe(ttf2woff())
    .pipe(gulp.dest(config.global.dev + '/resources/fonts/icons/'));
});

gulp.task('watch:icons', function() {
  const watch = require('gulp-watch');
  const runSequence = require('run-sequence');

  watch(
    config.global.src + config.global.resources + '/icons/*.svg',
    config.watch,
    function() {
      runSequence('iconfont', ['static:hb', 'resources:sass'], ['livereload']);
    }
  );
});
