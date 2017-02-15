var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var config = require('./../config');

gulp.task('jshint', function () {

	if (config.global.tasks.linting) {
		return gulp.src([
			config.global.src + '/resources/js/**/*.js',
			'!' + config.global.src + '/resources/js/vendor/**/*.js',
			'!' + config.global.src + '/resources/bower_components/**/*.js'
		])
			.pipe(cached('jshint'))
			.pipe(jshint())
			.pipe(jshint.reporter(stylish));
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});

gulp.task('watch:jshint', function () {

	if (config.global.tasks.linting) {
		watch([
			config.global.src + '/resources/js/**/*.js',
			'!' + config.global.src + '/resources/js/vendor/**/*.js',
			'!' + config.global.src + '/resources/bower_components/**/*.js'
		], function () {
			runSequence('jshint');
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});
