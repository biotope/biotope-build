var gulp = require('gulp');
var size = require('gulp-size');
var cleanCss = require('gulp-clean-css');
var mergeStream = require('merge-stream');
var config = require('./../config');
var gutil = require('gulp-util');

gulp.task('cleanCss:resources:dist', function () {

	if (!config.global.tasks.cleanCss) {
		gutil.log(gutil.colors.yellow('cleanCss disabled'));
	}

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.dev + currentResource + '/css/**/*.css')
			.pipe(config.global.tasks.cleanCss ? cleanCss(config.cleanCss) : gutil.noop())
			.pipe(config.global.tasks.cleanCss ? size({
				title: 'minified',
				showFiles: true
			}) : gutil.noop())
			.pipe(gulp.dest(config.global.dist + currentResource + '/css/'));
	}));

});

gulp.task('cleanCss:components:dist', function () {

	if (!config.global.tasks.cleanCss) {
		gutil.log(gutil.colors.yellow('cleanCss disabled'));
	}

	return mergeStream(config.global.components.map( function(currentComponent, index) {
		return gulp.src(config.global.dev + currentComponent + '/**/css/**/*.css')
			.pipe(config.global.tasks.cleanCss ? cleanCss(config.cleanCss) : gutil.noop())
			.pipe(config.global.tasks.cleanCss ? size({
				title: 'minified',
				showFiles: true
			}) : gutil.noop())
			.pipe(gulp.dest(config.global.dist + currentComponent));
	}));

});
