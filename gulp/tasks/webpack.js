var gulp = require('gulp');
var named = require('vinyl-named');
var mergeStream = require('merge-stream');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var webpackConfig = require('./../../webpack.config.js');
var config = require('./../config');

gulp.task('webpack', function() {

	if (config.global.tasks.webpack) {
		return mergeStream(config.global.resources.map( function(currentResource) {
			return gulp.src([
			    config.global.src + currentResource + '/jsx/*.jsx',
                config.global.src + currentResource + '/ts/*.ts'
            ])
				.pipe(named())
				.pipe(webpackStream(webpackConfig, webpack))
				.pipe(gulp.dest(config.global.dev + currentResource + '/jsx/'));
		}));
	} else {
		gutil.log(gutil.colors.yellow('webpack disabled'));
	}

});

gulp.task('watch:webpack', function () {

	if (config.global.tasks.webpack) {
		config.global.resources.forEach(function (currentResource) {
			watch([
				config.global.src + currentResource + '/jsx/**/*.jsx',
                config.global.src + currentResource + '/ts/**/*.ts'
			], function () {
				runSequence(
					['webpack']
				);
			});
		});
	}

});
