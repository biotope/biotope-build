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
		return mergeStream(config.global.resources.map( function(currentResource) {
			return config.global.reactEntryPoints.map(function (currentReact) {
				return gulp.src(config.global.src + config.global.components + '/**/react' + currentReact)
					.pipe(named())
					.pipe(webpackStream(webpackConfig, webpackReact).on('error', function(err) {
						gutil.log('Webpack React', err);
						this.emit('end');
					}))
					.pipe(rename({dirname: ''}))
					.pipe(gulp.dest(config.global.dev + currentResource + '/components/react/'));
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
		return mergeStream(config.global.resources.map( function(currentResource) {
			return gulp.src(config.global.src + config.global.components + '/**/ts/*.ts')
				.pipe(named())
				.pipe(webpackStream(webpackConfig, webpackTS).on('error', function(err) {
					gutil.log('Webpack TS', err);
					this.emit('end');
				}))
				.pipe(gulp.dest(config.global.dev + currentResource + '/components/ts/'));
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
		watch([
			config.global.src + config.global.components + '/**/react/**/*.+(j|t)sx',
			config.global.src + config.global.components + '/**/react/**/*.+(j|t)s',
			'!' + config.global.src + config.global.components + '/**/react/**/*.spec.(j|t)s'
		], function () {
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
		watch(config.global.src + config.global.components + '/**/ts/**/*.ts', function () {
			runSequence(
				['webpack:components:ts']
			);
		});
	}

});
