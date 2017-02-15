var gulp = require('gulp');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var config = require('./../config');

gulp.task('eslint', function () {

	if (config.global.tasks.linting) {
		return gulp.src([
			config.global.src + '/resources/js/**/*.js',
			'!' + config.global.src + '/resources/js/vendor/**/*.js',
			'!' + config.global.src + '/resources/bower_components/**/*.js'
		])
			.pipe(cached('eslint'))
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});

gulp.task('watch:eslint', function () {

	if (config.global.tasks.linting) {
		watch([
			config.global.src + '/resources/js/**/*.js',
			'!' + config.global.src + '/resources/js/vendor/**/*.js',
			'!' + config.global.src + '/resources/bower_components/**/*.js'
		], function () {
			runSequence('eslint')
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});
