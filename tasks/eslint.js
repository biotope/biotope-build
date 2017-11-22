const gulp = require('gulp');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const cached = require('gulp-cached');
const watch = require('gulp-watch');
const mergeStream = require('merge-stream');
const runSequence = require('run-sequence');

const config = require('./../config');

gulp.task('eslint:resources', function () {

	if (config.global.tasks.linting) {
		return mergeStream(config.global.resources.map(function (currentResource, index) {
			return gulp.src([
				config.global.src + currentResource + '/js/**/*.js',
				'!' + config.global.src + currentResource + '/js/vendor/**/*.js'
			])
				.pipe(cached('eslint'))
				.pipe(eslint())
				.pipe(eslint.format())
				.pipe(eslint.failAfterError());
		}));
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});

gulp.task('eslint:components', function () {

	if (config.global.tasks.linting) {
		return mergeStream(config.global.components.map(function (currentComponent) {
			return gulp.src([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			])
				.pipe(cached('eslint'))
				.pipe(eslint())
				.pipe(eslint.format())
				.pipe(eslint.failAfterError());
		}));
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});

gulp.task('watch:eslint:resources', function () {

	if (config.global.tasks.linting) {
		config.global.resources.forEach(function(currentResource, index) {
			watch([
				config.global.src + config.global.components[index] + '/**/js/**/*.js',
				'!' + config.global.src + currentResource + '/js/vendor/**/*.js',
			], config.watch, function () {
				runSequence('eslint:resources')
			});
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});

gulp.task('watch:eslint:components', function () {

	if (config.global.tasks.linting) {
		config.global.components.forEach(function(currentComponent) {
			watch([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			], config.watch, function () {
				runSequence('eslint:components')
			});
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});
