var gulp = require('gulp');
var less = require('gulp-less');
var lesshint = require('gulp-lesshint');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var mergeStream = require('merge-stream');
var config = require('./../config');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('less', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src([
			config.global.src + currentResource + '/less/**/*.less',
			'!' + config.global.src + currentResource + '/less/**/_*.less'
		])
			.pipe(sourcemaps.init())
			.pipe(less().on('error', less.logError))
			.pipe(postcss([
				autoprefixer(config.autoprefixer)
			]))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(config.global.dev + currentResource + '/css'));
	}));
});

gulp.task('lint:less', function() {
  if (config.global.tasks.linting) {
    return mergeStream(config.global.resources.map( function(currentResource) {
      return gulp.src(config.global.src + currentResource.replace('/','') + '/less/**/*.less')
				.pipe(cached('less'))
				.pipe(lesshint({}))
				.pipe(lesshint.reporter()) // Leave empty to use the default, "stylish"
				.pipe(lesshint.failOnError()); // Use this to fail the task on lint errors
    }));
  }
});

gulp.task('watch:less', function () {

	config.global.resources.forEach(function(currentResource) {
		watch([
			config.global.src + currentResource + '/css/**/*.less'
		], function () {
			runSequence(
				['lint:less'],
				['less']
			);
		});
	});

});
