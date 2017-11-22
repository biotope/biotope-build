const gulp = require('gulp');
const htmlhint = require("gulp-htmlhint");
const cached = require('gulp-cached');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

const config = require('./../config');

gulp.task('htmlhint', function () {

	return gulp.src(config.global.dev + '/*.html')
		.pipe(cached('htmlhint'))
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter('htmlhint-stylish'));

});

gulp.task('watch:html', function () {

	return watch([
		config.global.dev + '/*.html'
	], config.watch, function () {
		runSequence('htmlhint')
	});

});
