var gulp = require('gulp');
var webpack = require('webpack-stream');
var named = require('vinyl-named');
var mergeStream = require('merge-stream');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var config = require('./../config');
var webpackConfig = require('./../../../../webpack.config.js');

gulp.task('webpack', function() {

	if (config.global.tasks.webpack) {
		return mergeStream(config.global.resources.map( function(currentResource) {
			return gulp.src(config.global.src + currentResource + '/jsx/*.jsx')
				.pipe(named())
				.pipe(webpack(webpackConfig))
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
				config.global.src + currentResource + '/jsx/**/*.jsx'
			], function () {
				runSequence(
					['webpack']
				);
			});
		});
	}

});
