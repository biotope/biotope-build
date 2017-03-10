var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var mergeStream = require('merge-stream');
var config = require('./../config');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('less', function () {

  return mergeStream(config.global.resources.map( function(currentResource) {
    return gulp.src([
      config.global.src + currentResource + '/less/**/*.less',
      '!' + config.global.src + currentResource + '/less/**/_*.less'
    ])
				.pipe(sourcemaps.init())
				.pipe(less())
				.pipe(postcss([
				  autoprefixer(config.autoprefixer)
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.global.dev + currentResource + '/css'));
  }));
});

gulp.task('watch:less', function () {

	config.global.resources.forEach(function(currentResource) {
		watch([
			config.global.src + currentResource + '/less/**/*.less'
		], function () {
			runSequence(
				['lint:less'],
				['less']
			);
		});
	});

});
