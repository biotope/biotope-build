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
		return gulp.src([
			config.global.src + config.global.resources + '/js/**/*.js',
			'!' + config.global.src + config.global.resources + '/js/vendor/**/*.js'
		])
			.pipe(cached('eslint', { optimizeMemory: true }))
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
	} else {
		console.log(colors.yellow('linting resources disabled'));
	}
});

gulp.task('eslint:components', function () {
	if (config.global.tasks.linting) {
		return gulp.src([
			config.global.src + config.global.components + '/**/*.js',
			'!' + config.global.src + config.global.components + '/**/vendor/**/*.js'
		])
			.pipe(cached('eslint', { optimizeMemory: true }))
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
	} else {
		console.log(colors.yellow('linting components disabled'));
	}
});

gulp.task('watch:eslint:resources', function () {
	if (config.global.tasks.linting) {
		watch([
			config.global.src + config.global.resources + '/**/js/**/*.js',
			'!' + config.global.src + config.global.resources + '/js/vendor/**/*.js',
		], config.watch, function () {
			runSequence('eslint:resources')
		});
	}
});

gulp.task('watch:eslint:components', function () {
	if (config.global.tasks.linting) {
		watch([
			config.global.src + config.global.components + '/**/*.js',
			'!' + config.global.src + config.global.components + '/**/vendor/**/*.js'
		], config.watch, function () {
			runSequence('eslint:components')
		});
	}
});
