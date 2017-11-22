const gulp = require('gulp');
const colors = require('colors/safe');
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
				.pipe(cached('jshint', { optimizeMemory: true }))
				.pipe(jshint())
				.pipe(jshint.reporter(stylish));
		}));
	} else {
		console.log(colors.yellow('linting resources disabled'));
	}
});


gulp.task('jshint:components', function () {

	if (config.global.tasks.linting) {
		return mergeStream(config.global.components.map(function (currentComponent) {
			return gulp.src([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			])
				.pipe(cached('jshint', { optimizeMemory: true }))
				.pipe(jshint())
				.pipe(jshint.reporter(stylish));
		}));
	} else {
		console.log(colors.yellow('linting components disabled'));
	}
});

gulp.task('watch:jshint:resources', function () {

	if (config.global.tasks.linting) {
		config.global.resources.forEach(function(currentResource) {
			watch([
				config.global.src + currentResource + '/js/**/*.js',
				'!' + config.global.src + currentResource + '/js/vendor/**/*.js',
			], config.watch, function () {
				runSequence('jshint:resources');
			});
		});
	}
});

gulp.task('watch:jshint:components', function () {

	if (config.global.tasks.linting) {
		config.global.components.forEach(function(currentComponent) {
			watch([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			], config.watch, function () {
				runSequence('jshint:components');
			});
		});
	}
});
