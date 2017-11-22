const gulp = require('gulp');
const gutil = require('gulp-util');
const jsonlint = require('gulp-jsonlint');
const cached = require('gulp-cached');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

const config = require('./../config');

gulp.task('lint:json', function () {

	if (config.global.tasks.linting) {
		return gulp.src(config.global.src + "/**/*.json")
			.pipe(cached('json'))
			.pipe(jsonlint())
			.pipe(jsonlint.reporter());
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});


gulp.task('watch:json', function () {

	if (config.global.tasks.linting) {
		return watch([
			config.global.src + '/**/*.json'
		], config.watch, function () {
			runSequence('lint:json');
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});
