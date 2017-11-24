const gulp = require('gulp');
const colors = require('colors/safe');
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
				.pipe(cached('eslint', { optimizeMemory: true }))
				.pipe(eslint())
				.pipe(eslint.format())
				.pipe(eslint.failAfterError());
		}));
	} else {
		console.log(colors.yellow('linting resources disabled'));
	}
});

gulp.task('eslint:components', function () {

	if (config.global.tasks.linting) {
		return mergeStream(config.global.components.map(function (currentComponent) {
			return gulp.src([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			])
				.pipe(cached('eslint', { optimizeMemory: true }))
				.pipe(eslint())
				.pipe(eslint.format())
				.pipe(eslint.failAfterError());
		}));
	} else {
		console.log(colors.yellow('linting components disabled'));
	}
});

gulp.task('watch:eslint:resources', function () {

	if (config.global.tasks.linting) {
		config.global.resources.forEach(function(currentResource) {
			watch([
				config.global.src + currentResource + '/**/js/**/*.js',
				'!' + config.global.src + currentResource + '/js/vendor/**/*.js',
			], config.watch, function () {
				runSequence('eslint:resources')
			});
		});
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
	}
});
