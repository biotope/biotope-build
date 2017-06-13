var gulp = require('gulp');
var named = require('vinyl-named');
var mergeStream = require('merge-stream');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var webpackReact = require('webpack');
var webpackTS = require('webpack');
var webpackStream = require('webpack-stream');
var webpackConfig = require('./../../webpack.config.js');
var config = require('./../config');

gulp.task('webpack:react', function() {

    if (config.global.tasks.webpack && config.global.reactEntryPoints.length) {
        return mergeStream(config.global.resources.map( function(currentResource) {
			return config.global.reactEntryPoints.map(function (currentReact) {
				return gulp.src(config.global.src + currentResource + '/react' + currentReact)
					.pipe(named())
					.pipe(webpackStream(webpackConfig, webpackReact, function(err) {
						new gutil.PluginError('React Task', err, {showStack: true});
						// this.emit('end');
					}))
					.pipe(gulp.dest(config.global.dev + currentResource + '/react/'));
			});
		}));
    } else {
        gutil.log(gutil.colors.yellow('webpack:react disabled'));
    }

});

gulp.task('webpack:ts', function() {

    if (config.global.tasks.webpack) {
        return mergeStream(config.global.resources.map( function(currentResource) {
			return gulp.src(config.global.src + currentResource + '/ts/*.ts')
				.pipe(named())
				.pipe(webpackStream(webpackConfig, webpackTS, function(err) {
					new gutil.PluginError('TS Task', err, {showStack: true});
					// this.emit('end');
				}))
				.pipe(gulp.dest(config.global.dev + currentResource + '/ts/'));
        }));
    } else {
        gutil.log(gutil.colors.yellow('webpack:ts disabled'));
    }

});

gulp.task('watch:webpack:react', function () {

    if (config.global.tasks.webpack) {
        config.global.resources.forEach(function (currentResource) {
			watch([
				config.global.src + currentResource + '/react/**/*.+(j|t)sx',
				config.global.src + currentResource + '/react/**/*.+(j|t)s',
				'!' + config.global.src + currentResource + '/react/**/*.spec.(j|t)s'
			], function () {
                runSequence(
                    ['webpack:react']
                );
            });
        });
    }

});

gulp.task('watch:webpack:ts', function () {

    if (config.global.tasks.webpack) {
        config.global.resources.forEach(function (currentResource) {
            watch(config.global.src + currentResource + '/ts/**/*.ts', function () {
                runSequence(
                    ['webpack:ts']
                );
            });
        });
    }

});
