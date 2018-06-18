const gulp = require('gulp');
const config = require('./../config');

gulp.task('handlebars', function() {
  const colors = require('colors/safe');

  if (config.global.tasks.handlebars) {
    const path = require('path');
    const handlebars = require('gulp-handlebars');
    const wrap = require('gulp-wrap');
    const declare = require('gulp-declare');
    const concat = require('gulp-concat');
    const mergeStream = require('merge-stream');
    const plumber = require('gulp-plumber');
    const bioHelpers = require('./../lib/hb2-helpers');

    // Assume all partials start with an underscore
    const partials = gulp
      .src([
        config.global.src + config.global.resources + '/hbs/**/_*.hbs',
        config.global.src + config.global.components + '/**/hbs/**/_*.hbs'
      ])
      .pipe(plumber())
      .pipe(
        handlebars({
          handlebars: require('handlebars')
        })
      )
      .pipe(
        wrap(
          config.handlebars.partialWrap,
          {
            processPartialName: function(fileName) {
              // Strip the extension and the underscore
              // Escape the output with JSON.stringify
              return JSON.stringify(path.basename(fileName, '.js').substr(1));
            }
          },
          {}
        )
      );

    const templates = gulp
      .src([
        config.global.src + config.global.resources + '/hbs/**/[^_]*.hbs',
        config.global.src + config.global.components + '/**/hbs/**/[^_]*.hbs'
      ])
      .pipe(plumber())
      .pipe(
        handlebars({
          handlebars: require('handlebars')
        })
      )
      .pipe(wrap(config.handlebars.templateWrap))
      .pipe(
        declare({
          namespace: config.handlebars.namespace,
          noRedeclare: config.handlebars.noRedeclare
        })
      );

    // Output both the partials and the templates
    return mergeStream(partials, templates)
      .pipe(concat('handlebars.templates.js'))
      .pipe(
        wrap(
          '(function (root, factory) {if (typeof module === \'object\' && module.exports) {module.exports = factory(require(\'handlebars\'));} else {factory(root.Handlebars);}}(this, function (Handlebars) { (<%= data.bioHelpers %>)(Handlebars); <%= data.contents %> }));',
          { bioHelpers: bioHelpers },
          { variable: 'data' }
        )
      )
      .pipe(gulp.dest(config.global.dev + config.global.resources + '/js/'));
  } else {
    console.log(colors.yellow('handlebars disabled'));
  }
});

gulp.task('watch:handlebars', function() {
  if (config.global.tasks.handlebars) {
    const watch = require('gulp-watch');
    const runSequence = require('run-sequence');
    const watchFiles = [];

    watchFiles.push(
      config.global.src + config.global.resources + '/hbs/**/*.hbs'
    );
    watchFiles.push(
      config.global.src + config.global.resources + '/js/handlebars.helper.js'
    );
    watchFiles.push(
      config.global.src + config.global.components + '/**/hbs/**/*.hbs'
    );

    watch(watchFiles, config.watch, function() {
      runSequence(['handlebars'], ['livereload']);
    });
  }
});
