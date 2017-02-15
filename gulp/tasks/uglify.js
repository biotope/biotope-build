var gulp = require('gulp');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var mergeStream = require('merge-stream');
var config = require('./../config');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('uglify:dist', function () {

	if (!config.global.tasks.uglify) {
		gutil.log(gutil.colors.yellow('uglify disabled'));
	}

	return mergeStream(config.global.resources.map( function(currentResource) {
		var srcArray = [config.global.dev + currentResource + '/js/**/*.js'];

		config.global.uglifyExceptions.forEach(function(exception) {
			srcArray.push('!' + config.global.dev + currentResource + '/js/**/' + exception);
		});

		return gulp.src(srcArray)
			.pipe(sourcemaps.init())
			.pipe(config.global.tasks.uglify ? uglify() : gutil.noop())
			.pipe(config.global.tasks.uglify ? size({
				title: 'uglified',
				showFiles: true
			}) : gutil.noop())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(config.global.dist + currentResource + '/js/'));
	}));
});
