const gulp = require('gulp');
const colors = require('colors/safe');
const jsonlint = require('gulp-jsonlint');
const cached = require('gulp-cached');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

const config = require('./../config');

gulp.task('lint:json', function () {

	if (config.global.tasks.linting) {
		return gulp.src(config.global.src + "/**/*.json")
			.pipe(cached('json', { optimizeMemory: true }))
			.pipe(jsonlint())
			.pipe(jsonlint.reporter());
	} else {
		console.log(colors.yellow('linting json disabled'));
	}
});

gulp.task('watch:json', function () {

	if (config.global.tasks.linting) {
		watch([
			config.global.src + '/**/*.json'
		], config.watch, function () {
			runSequence('lint:json');
		});
	}
});
