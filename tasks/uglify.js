const gulp = require('gulp');
const size = require('gulp-size');
const uglify = require('gulp-uglify');
const mergeStream = require('merge-stream');
const notify = require('gulp-notify');
const colors = require('colors/safe');
const sourcemaps = require('gulp-sourcemaps');

const config = require('./../config');

gulp.task('uglify:resources:dist', function () {

	if (config.global.tasks.uglify) {

		return mergeStream(config.global.resources.map( function(currentResource) {
			return mergeStream(config.uglify.folders.map( function(folder) {

				const srcArray = [config.global.dev + currentResource + '/' + folder + '/**/*.js'];

				config.uglify.ignoreList.forEach(function (path) {
					srcArray.push('!' + config.global.dev + currentResource + path);
				});

				const stream = gulp.src(srcArray);

				if(config.uglify.sourcemaps) {
					stream.pipe(sourcemaps.init());
				}

				stream.pipe(uglify()).on('error', notify.onError((error) => {
					return {
						title: 'uglify:resources:dist',
						message: error.message
					};
				}))
					.pipe(size({
						title: 'uglified',
						showFiles: true
					}));

				if(config.uglify.sourcemaps) {
					stream.pipe(sourcemaps.write());
				}

				stream.pipe(gulp.dest(config.global.dist + currentResource + '/' + folder + '/'));
				return stream;
			}));
		}));

	} else {
		console.log(colors.yellow('uglify resources disabled'));
	}
});


gulp.task('uglify:components:dist', function () {

	if (config.global.tasks.uglify) {

		return mergeStream(config.global.resources.map( function(currentResource, index) {

			const srcArray = [config.global.dev + currentResource + config.global.components[index] + '/**/*.js'];

			config.uglify.ignoreList.forEach(function (path) {
				srcArray.push('!' + config.global.dev + currentComponent + path);
			});

			const stream = gulp.src(srcArray);

			if(config.uglify.sourcemaps) {
				stream.pipe(sourcemaps.init());
			}

			stream.pipe(uglify()).on('error', notify.onError((error) => {
				return {
					title: 'uglify:components:dist',
					message: error.message
				};
			}))
				.pipe(size({
					title: 'uglified',
					showFiles: true
				}));

			if(config.uglify.sourcemaps) {
				stream.pipe(sourcemaps.write());
			}

			stream.pipe(gulp.dest(config.global.dist + currentResource + config.global.components[index]));
			return stream;
		}));

	} else {
		console.log(colors.yellow('uglify components disabled'));
	}
});
