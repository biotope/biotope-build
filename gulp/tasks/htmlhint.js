var gulp = require('gulp');
var htmlhint = require("gulp-htmlhint");
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var config = require('./../config');


gulp.task('htmlhint', function () {

	return gulp.src(config.global.dev + '/*.html')
		.pipe(cached('htmlhint'))
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter('htmlhint-stylish'));

});

gulp.task('watch:html', function () {

	watch([
		config.global.dev + '/*.html'
	], function () {
		runSequence('htmlhint')
	});

});
