var gulp = require('gulp');
var named = require('vinyl-named');
var mergeStream = require('merge-stream');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var webpackReact = require('webpack');
var webpackTS = require('webpack');
var webpackStream = require('webpack-stream');
var webpackConfig = require('./../../webpack.config.js');
var config = require('./../config');

/**
 * @TODO fix typing errors
 */

gulp.task('webpack:resources:react', function() {

	if (config.global.tasks.webpack && config.global.reactEntryPoints.length) {
		return mergeStream(config.global.resources.map( function(currentResource) {
			return config.global.reactEntryPoints.map(function (currentReact) {
				return gulp.src(config.global.src + currentResource + '/react' + currentReact)
					.pipe(named())
					.pipe(webpackStream(webpackConfig, webpackReact).on('error', function(err) {
						gutil.log('Webpack React', err);
						this.emit('end');
					}))
					.pipe(gulp.dest(config.global.dev + currentResource + '/react/'));
			});
		}));
	} else {
		gutil.log(gutil.colors.yellow('webpack:react disabled'));
	}

});

gulp.task('webpack:components:react', function() {

	if (config.global.tasks.webpack && config.global.reactEntryPoints.length) {
		return mergeStream(config.global.resources.map( function(currentResource, index) {
			return config.global.reactEntryPoints.map(function (currentReact) {
				let tmp = {};
				return gulp.src(config.global.src + config.global.components[index] + '/**' + currentReact)
					.pipe(named())
					.pipe(rename(function (path) {
						tmp[path.basename] = path;
					}))
					.pipe(webpackStream(webpackConfig, webpackReact).on('error', function(err) {
						gutil.log('Webpack React', err);
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

			});
		}));
	}

});

gulp.task('webpack:resources:ts', function() {

	if (config.global.tasks.webpack) {
		return mergeStream(config.global.resources.map( function(currentResource) {
			return gulp.src(config.global.src + currentResource + '/ts/*.ts')
				.pipe(named())
				.pipe(webpackStream(webpackConfig, webpackTS).on('error', function(err) {
					gutil.log('Webpack TS', err);
					this.emit('end');
				}))
				.pipe(gulp.dest(config.global.dev + currentResource + '/ts/'));
		}));
	} else {
		gutil.log(gutil.colors.yellow('webpack:ts disabled'));
	}

});

gulp.task('webpack:components:ts', function() {
	if (config.global.tasks.webpack) {
		return mergeStream(config.global.resources.map( function(currentResource, index) {
			let tmp = {};
			return gulp.src(config.global.src + config.global.components[index] + '/**/*.ts')
				.pipe(named())
				.pipe(rename(function (path) {
					tmp[path.basename] = path;
				}))
				.pipe(webpackStream(webpackConfig, webpackTS).on('error', function(err) {
					gutil.log('Webpack TS', err);
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

gulp.task('watch:webpack:resources:react', function () {

	if (config.global.tasks.webpack) {
		config.global.resources.forEach(function (currentResource) {
			watch([
				config.global.src + currentResource + '/react/**/*.+(j|t)sx',
				config.global.src + currentResource + '/react/**/*.+(j|t)s',
				'!' + config.global.src + currentResource + '/react/**/*.spec.(j|t)s'
			], function () {
				runSequence(
					['webpack:resources:react']
				);
			});
		});
	}

});

gulp.task('watch:webpack:components:react', function () {

	if (config.global.tasks.webpack) {

		let components = [];
		config.global.components.map( function(currentComponent) {
			components.push(config.global.src + currentComponent + '/**/react/**/*.+(j|t)sx');
			components.push(config.global.src + currentComponent + '/**/react/**/*.+(j|t)s');
			components.push('!' + config.global.src + currentComponent + '/**/*.spec.(j|t)s');
		});

		watch(components, function () {
			runSequence(
				['webpack:components:react']
			);
		});
	}

});

gulp.task('watch:webpack:resources:ts', function () {

	if (config.global.tasks.webpack) {
		config.global.resources.forEach(function (currentResource) {
			watch(config.global.src + currentResource + '/ts/**/*.ts', function () {
				runSequence(
					['webpack:resources:ts']
				);
			});
		});
	}

});

gulp.task('watch:webpack:components:ts', function () {

	if (config.global.tasks.webpack) {

		let components = [];
		config.global.components.map( function(currentComponent) {
			components.push(config.global.src + currentComponent + '/**/*.ts');
		});

		watch(components, function () {
			runSequence(
				['webpack:components:ts']
			);
		});
	}

});
