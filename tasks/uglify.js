const gulp = require('gulp');
const size = require('gulp-size');
const uglify = require('gulp-uglify');
const mergeStream = require('merge-stream');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');

const config = require('./../config');

gulp.task('uglify:resources:dist', function () {

	if (config.global.tasks.uglify) {

		return mergeStream(config.global.resources.map( function(currentResource) {
			return mergeStream(config.uglify.folders.map( function(folder) {

				let srcArray = [config.global.dev + currentResource + '/' + folder + '/**/*.js'];

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

			const srcArray = [config.global.dev + currentResource + config.global.components[index] + '/**/*.js'];

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
