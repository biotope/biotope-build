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
		return gulp.src([
			config.global.src + config.global.resources + '/js/**/*.js',
			'!' + config.global.src + config.global.resources + '/js/vendor/**/*.js'
		])
			.pipe(cached('jshint', { optimizeMemory: true }))
			.pipe(jshint())
			.pipe(jshint.reporter(stylish));
	} else {
		console.log(colors.yellow('linting resources disabled'));
	}
});

gulp.task('jshint:components', function () {
	if (config.global.tasks.linting) {
		return gulp.src([
			config.global.src + config.global.components + '/**/*.js',
			'!' + config.global.src + config.global.components + '/**/vendor/**/*.js'
		])
			.pipe(cached('jshint', { optimizeMemory: true }))
			.pipe(jshint())
			.pipe(jshint.reporter(stylish));
	} else {
		console.log(colors.yellow('linting components disabled'));
	}
});

gulp.task('watch:jshint:resources', function () {
	if (config.global.tasks.linting) {
		watch([
			config.global.src + config.global.resources + '/js/**/*.js',
			'!' + config.global.src + config.global.resources + '/js/vendor/**/*.js',
		], config.watch, function () {
			runSequence('jshint:resources');
		});
	}
});

gulp.task('watch:jshint:components', function () {
	if (config.global.tasks.linting) {
		watch([
			config.global.src + config.global.components + '/**/*.js',
			'!' + config.global.src + config.global.components + '/**/vendor/**/*.js'
		], config.watch, function () {
			runSequence('jshint:components');
		});
	}
});
