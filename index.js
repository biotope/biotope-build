const localPackage = require('./package.json');
const log = require('console-emoji');
log(`:sparkles: Starting Biotope Build (v${localPackage.version}) with :sparkling_heart:for Frontend Developers around the world :sparkles:\n`, 'green');

const gulp = require('gulp');
const runSequence = require('run-sequence');
const requireDir = require('require-dir');
requireDir('./tasks', { recurse: true });

// Prevent errors caused by too many listeners in gulp-watch
require('events').EventEmitter.defaultMaxListeners = 0;

// configure default task
gulp.task('default', ['serve']);


// build templates for development
gulp.task('build:dev', function (callback) {
  runSequence(
    // ⚠️ does not work with custom tags
    // 'checkDependencies',
    [
      'clean:dev',
      'clean:iconfont',
      'clean:svgSprite'
    ],
    [
      'lint:json',
      'eslint:resources',
      'eslint:components',
      'iconfont',
      'svgSprite',
      'copy:dev:npm:js',
      'copy:dev:npm:css',
      'init:hb2'
    ],
    [
      'handlebars'
    ],
    [
      'static:hb2'
    ],
    [
      // needs to be independent, so ts and sass overrides default files
      'copy:dev:components:files'
    ],
    [
      'sass',
      'webpack:ts'
    ],
    [
      'modernizr',
      'htmlhint'
    ],
    callback
  );
});


// build templates for production
gulp.task('build', function (callback) {
  runSequence(
    [
      'clean:dist',
      'build:dev'
    ],
    [
      'copy:dev:resources:js'
    ],
    [
      'useref'
    ],
    [
      'useref:assets',
      'image:resources:dist',
      'image:component:dist',
      'favicons'
    ],
    [
      'copy:dist:resources:js',
      'copy:dist:resources:react',
      'copy:dist:resources:ts-js',
      'copy:dist:resources:json',
      'copy:dist:resources:fonts',
      'copy:dist:resources:img',
      'copy:dist:resources:assets',
      'copy:dist:resources:css',
      'copy:dist:resources:components',
      'copy:dist:resources:hbs',
      'copy:dist:component:mock',
      'copy:dist:components:files',
      'copy:dist:config',
      'copy:dist:mock',
      'copy:dist:assets',
      'copy:dist:svgSprite'
    ],
    [
      'uglify:resources:dist',
      'uglify:components:dist',
      'cleanCss:resources:dist',
      'cleanCss:components:dist'
    ],
    [
      'inject',
      'clean:useref',
      'cssstats',
      'version'
    ],
    callback
  );
});


// serve development templates
gulp.task('serve', function (callback) {
  runSequence(
    'build:dev',
    [
      'watch:templates:hb2',
      'watch:partials:hb2',
      'watch:jsons:hb2',
      'watch:icons:hb2',
      'watch:components:files',
      'watch:sass',
      'watch:eslint:components',
      'watch:eslint:resources',
      'watch:handlebars',
      'watch:json',
      'watch:html',
      'watch:webpack:ts',
      'watch:icons'
    ],
    'connect',
    'connect:open',
    callback
  );
});


// serve production templates
gulp.task('serve:dist', function (callback) {
  runSequence(
    'build',
    callback
  );
});

module.exports = gulp.tasks;
