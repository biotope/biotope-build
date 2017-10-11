var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mergeStream = require('merge-stream');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var config = require('./../config');

gulp.task('jshint:resources', function () {

	if (config.global.tasks.linting) {
		return mergeStream(config.global.resources.map(function (currentResource) {
			return gulp.src([
				config.global.src + currentResource + '/js/**/*.js',
				'!' + config.global.src + currentResource + '/js/vendor/**/*.js'
			])
				.pipe(cached('jshint'))
				.pipe(jshint())
				.pipe(jshint.reporter(stylish));
		}));
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});


gulp.task('jshint:components', function () {

	if (config.global.tasks.linting) {
		return mergeStream(config.global.components.map(function (currentComponent) {
			return gulp.src([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			])
				.pipe(cached('jshint'))
				.pipe(jshint())
				.pipe(jshint.reporter(stylish));
		}));
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});

gulp.task('watch:jshint:resources', function () {

	if (config.global.tasks.linting) {
		config.global.resources.forEach(function(currentResource) {
			watch([
				config.global.src + currentResource + '/js/**/*.js',
				'!' + config.global.src + currentResource + '/js/vendor/**/*.js',
			], function () {
				runSequence('jshint:resources');
			});
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});

gulp.task('watch:jshint:components', function () {

	if (config.global.tasks.linting) {
		config.global.components.forEach(function(currentComponent) {
			watch([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			], function () {
				runSequence('jshint:components');
			});
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});
