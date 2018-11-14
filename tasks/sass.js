const gulp = require('gulp');
const config = require('./../config');
const path = require('path');

gulp.task('sass', function() {
  if (config.global.tasks.sass) {
    const sass = require('gulp-sass');
    const postcss = require('gulp-postcss');
    const autoprefixer = require('autoprefixer');
    const sourcemaps = require('gulp-sourcemaps');
    const cached = require('gulp-cached');
    const dependents = require('gulp-dependents');
    const rename = require('gulp-rename');

    const componentsFolderName = config.global.components.slice(1);
    const resourcesFolderName = config.global.resources.slice(1);
    const scssResourcesFolderName = resourcesFolderName + '\\scss';

    return gulp
      .src([
        config.global.src + '/**/*.s+(a|c)ss'
      ])
      .pipe(cached('resourcesSass'))
      .pipe(dependents())
      .pipe(sourcemaps.init())
      .pipe(sass(config.sass).on('error', sass.logError))
      .pipe(postcss([autoprefixer(config.autoprefixer)]))
      .pipe(sourcemaps.write('.'))
      .pipe(rename(function(currentFile) {
          if (currentFile.dirname.indexOf(componentsFolderName) === 0 ) {
            currentFile.dirname = path.join(config.global.resources,currentFile.dirname);
          }
          if (currentFile.dirname.indexOf(resourcesFolderName) === 0) {
            currentFile.dirname = path.join(config.global.resources, 'css', currentFile.dirname.replace(scssResourcesFolderName, ''));
          }
      }))
      .pipe(gulp.dest(config.global.dev));
  } else {
    const colors = require('colors/safe');
    console.log(colors.yellow('sass resources disabled'));
  }
});

/**
 * scss file liniting
 * @TODO throws warnings now, define linting rules, remove && false
 */
gulp.task('lint:sass', function() {
  if (config.global.tasks.sass && config.global.tasks.linting && false) {
    const sassLint = require('gulp-sass-lint');
    const cached = require('gulp-cached');

    return gulp
      .src([
        config.global.src + '/**/*.s+(a|c)ss',
        '!' + config.global.src + '**/_icons.s+(a|c)ss',
        '!' + config.global.src + '**/_iconClasses.s+(a|c)ss'
      ])
      .pipe(cached('sass', { optimizeMemory: true }))
      .pipe(sassLint(config.global.sassLint))
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError());
  }
});

gulp.task('watch:sass', function() {
  if (config.global.tasks.sass) {
    const watch = require('gulp-watch');
    const runSequence = require('run-sequence');

    watch(
      [config.global.src + '/**/*.s+(a|c)ss'],
      config.watch,
      function() {
        runSequence(
          ['lint:sass'],
          ['sass'],
          ['livereload']
        );
      }
    );

    watch(
      [config.global.src + '../.iconfont' + '/*.scss'],
      config.watch,
      function() {
        runSequence(
          ['lint:sass'],
          ['sass'],
          ['livereload']
        );
      }
    );
  }
});
