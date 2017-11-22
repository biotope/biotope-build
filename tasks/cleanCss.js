const gulp = require('gulp');
const size = require('gulp-size');
const cleanCss = require('gulp-clean-css');
const mergeStream = require('merge-stream');
const gutil = require('gulp-util');

const config = require('./../config');

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

	return mergeStream(config.global.resources.map( function(currentResource, index) {
		return gulp.src(config.global.dev + currentResource + config.global.components[index] + '/**/*.css')
			.pipe(config.global.tasks.cleanCss ? cleanCss(config.cleanCss) : gutil.noop())
			.pipe(config.global.tasks.cleanCss ? size({
				title: 'minified',
				showFiles: true
			}) : gutil.noop())
			.pipe(gulp.dest(config.global.dist + currentResource + config.global.components[index]));
	}));

});
