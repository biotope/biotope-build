const gulp = require('gulp');
const config = require('./../config');
const {
	getComponentPathSrc,
} = require('../helper/getComponentPath');

gulp.task('eslint:resources', function () {
	const colors = require('colors/safe');

	if (config.global.tasks.linting) {
		const eslint = require('gulp-eslint');
		const cached = require('gulp-cached');

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
	const colors = require('colors/safe');

	if (config.global.tasks.linting) {
		const eslint = require('gulp-eslint');
		const cached = require('gulp-cached');

		return gulp.src([
			getComponentPathSrc() + '/**/*.js',
			'!' + getComponentPathSrc() + '/**/vendor/**/*.js'
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
		const watch = require('gulp-watch');
		const runSequence = require('run-sequence');

		watch([
			config.global.src + config.global.resources + '/**/js/**/*.js',
			'!' + config.global.src + config.global.resources + '/js/vendor/**/*.js',
		], config.watch, function () {
			runSequence(
				['eslint:resources'],
				['livereload']
			)
		});
	}
});

gulp.task('watch:eslint:components', function () {
	if (config.global.tasks.linting) {
		const watch = require('gulp-watch');
		const runSequence = require('run-sequence');

		watch([
			getComponentPathSrc() + '/**/*.js',
			'!' + getComponentPathSrc() + '/**/vendor/**/*.js'
		], config.watch, function () {
			runSequence(
				['eslint:components'],
				['livereload']
			)
		});
	}
});
