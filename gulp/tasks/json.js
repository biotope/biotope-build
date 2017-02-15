var gulp = require('gulp');
var gutil = require('gulp-util');
var jsonlint = require('gulp-jsonlint');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var config = require('./../config');

gulp.task('lint:json', function () {

	if (config.global.tasks.linting) {
		return gulp.src(config.global.src + "/_mock/**/*.json")
			.pipe(cached('json'))
			.pipe(jsonlint())
			.pipe(jsonlint.reporter());
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});


gulp.task('watch:json', function () {

	if (config.global.tasks.linting) {
		watch([
			config.global.src + '/_mock/**/*.json'
		], function () {
			runSequence('lint:json');
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});
