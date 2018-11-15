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
    'checkDependencies',
    [
      'clean:dev',
      'clean:iconfont',
      'clean:svgSprite'
    ],
    [
      'lint:sass',
      'lint:json',
      'eslint:resources',
      'eslint:components',
      'iconfont',
      'svgSprite',
      'copy:dev:npm:js',
      'copy:dev:npm:css',
      'copy:dev:npm:bower',
      'init:hb2'
    ],
    [
      'handlebars'
    ],
    [
      'static:hb2'
    ],
    [
      'sass',
      'webpack:ts',
      'copy:dev:components:js'
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
      'copy:dev:js'
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
      'copy:dist:js',
      'copy:dist:react',
      'copy:dist:ts',
      'copy:dist:flash',
      'copy:dist:json',
      'copy:dist:fonts',
      'copy:dist:resources:img',
      'copy:dist:components:img',
      'copy:dist:assets',
      'copy:dist:css',
      'copy:dist:mock',
      'copy:dist:component:mock',
      'copy:dist:config',
      'copy:dist:hbs',
      'copy:dist:bower',
      'copy:dist:components',
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
      'watch:components:js',
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
