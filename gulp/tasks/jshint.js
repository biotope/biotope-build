var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mergeStream = require('merge-stream');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var config = require('./../config');

gulp.task('jshint', function () {

	if (config.global.tasks.linting) {
		return mergeStream(config.global.resources.map(function (currentResource, index) {
			return gulp.src([
				config.global.src + currentResource + '/js/**/*.js',
				config.global.src + config.global.components[index] + '/**/js/**/*.js',
				'!' + config.global.src + currentResource + '/js/vendor/**/*.js',
				'!' + config.global.src + config.global.components[index] + '/**/js/vendor/**/*.js'
			])
				.pipe(cached('jshint'))
				.pipe(jshint())
				.pipe(jshint.reporter(stylish));
		}));
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});

gulp.task('watch:jshint', function () {

	if (config.global.tasks.linting) {
		config.global.resources.forEach(function(currentResource, index) {
			watch([
				config.global.src + currentResource + '/js/**/*.js',
				config.global.src + config.global.components[index] + '/**/js/**/*.js',
				'!' + config.global.src + currentResource + '/js/vendor/**/*.js',
				'!' + config.global.src + config.global.components[index] + '/**/js/vendor/**/*.js'
			], function () {
				runSequence('jshint');
			});
		});
	} else {
		gutil.log(gutil.colors.yellow('linting disabled'));
	}

});
