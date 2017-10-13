var gulp = require('gulp');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var mergeStream = require('merge-stream');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var config = require('./../config');

gulp.task('uglify:resources:dist', function () {

	if (config.global.tasks.uglify) {

		return mergeStream(config.global.resources.map( function(currentResource) {
			return mergeStream(config.uglify.folders.map( function(folder) {

				var srcArray = [config.global.dev + currentResource + '/' + folder + '/**/*.js'];

				config.uglify.ignoreList.forEach(function (path) {
					srcArray.push('!' + config.global.dev + currentResource + path);
				});

				return gulp.src(srcArray)
					.pipe(config.uglify.sourcemaps ? sourcemaps.init() : gutil.noop())
					.pipe(uglify()).on('error', gutil.log)
					.pipe(size({
						title: 'uglified',
						showFiles: true
					}))
					.pipe(config.uglify.sourcemaps ? sourcemaps.write() : gutil.noop())
					.pipe(gulp.dest(config.global.dist + currentResource + '/' + folder + '/'));
			}));
		}));

	} else {
		gutil.log(gutil.colors.yellow('uglify disabled'));
	}
});


gulp.task('uglify:components:dist', function () {

	if (config.global.tasks.uglify) {

		return mergeStream(config.global.resources.map( function(currentResource, index) {


			var srcArray = [config.global.dev + currentResource + config.global.components[index] + '/**/*.js'];

			config.uglify.ignoreList.forEach(function (path) {
				srcArray.push('!' + config.global.dev + currentComponent + path);
			});

			return gulp.src(srcArray)
				.pipe(config.uglify.sourcemaps ? sourcemaps.init() : gutil.noop())
				.pipe(uglify()).on('error', gutil.log)
				.pipe(size({
					title: 'uglified',
					showFiles: true
				}))
				.pipe(config.uglify.sourcemaps ? sourcemaps.write() : gutil.noop())
				.pipe(gulp.dest(config.global.dist + currentResource + config.global.components[index]));
		}));

	} else {
		gutil.log(gutil.colors.yellow('uglify disabled'));
	}
});
