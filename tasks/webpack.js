const gulp = require('gulp');
const named = require('vinyl-named');
const mergeStream = require('merge-stream');
const watch = require('gulp-watch');
const colors = require('colors/safe');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const webpackTS = require('webpack');
const webpackStream = require('webpack-stream');

const webpackConfig = require('./../webpack.config.js');
const config = require('./../config');

gulp.task('webpack:resources:ts', function() {

	if (config.global.tasks.webpack) {
		return mergeStream(config.global.resources.map( function(currentResource) {
			return gulp.src(config.global.src + currentResource + '/ts/*.ts')
				.pipe(named())
				.pipe(webpackStream(webpackConfig, webpackTS).on('error', function(error) {
					this.emit('end');
				}))
				.pipe(gulp.dest(config.global.dev + currentResource + '/ts/'));
		}));
	} else {
		console.log(colors.yellow('webpack:ts disabled'));
	}
});

gulp.task('webpack:components:ts', function() {
	if (config.global.tasks.webpack) {
		return mergeStream(config.global.resources.map( function(currentResource, index) {
			const tmp = {};

			return gulp.src(config.global.src + config.global.components[index] + '/**/*.ts')
				.pipe(named())
				.pipe(rename(function (path) {
					tmp[path.basename] = path;
				}))
				.pipe(webpackStream(webpackConfig, webpackTS).on('error', function(error) {
					this.emit('end');
				}))
				.pipe(rename(function (path) {
					for (key in tmp) {

						if (key === path.basename) {
							path.dirname = tmp[path.basename].dirname;
						}
						if (key === path.basename.replace('.js', '')) {
							path.dirname = tmp[path.basename.replace('.js', '')].dirname;
						}
					}
				}))
				.pipe(gulp.dest(config.global.dev + currentResource + config.global.components[index]));

		}));
	}
});

gulp.task('watch:webpack:resources:ts', function () {

	if (config.global.tasks.webpack) {
		config.global.resources.forEach(function (currentResource) {
			watch(config.global.src + currentResource + '/ts/**/*.ts', config.watch, function () {
				runSequence(
					['webpack:resources:ts']
				);
			});
		});
	}
});

gulp.task('watch:webpack:components:ts', function () {

	if (config.global.tasks.webpack) {
		config.global.components.map( function(currentComponent) {
			watch(config.global.src + currentComponent + '/**/*.ts', config.watch, function () {
				runSequence(
					['webpack:components:ts']
				);
			});
		});
	}
});
