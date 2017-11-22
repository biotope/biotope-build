const gulp = require('gulp');
const gutil = require('gulp-util');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const mergeStream = require('merge-stream');
const cached = require('gulp-cached');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

const config = require('./../config');

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
			return watch([
				config.global.src + currentResource + '/js/**/*.js',
				'!' + config.global.src + currentResource + '/js/vendor/**/*.js',
			], config.watch, function () {
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
			return watch([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			], config.watch, function () {
				runSequence('jshint:components');
			});
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});
