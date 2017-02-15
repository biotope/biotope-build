var gulp = require('gulp');
var gutil = require('gulp-util');
var iconfontCss = require('gulp-iconfont-css');
var svgicons2svgfont = require('gulp-svgicons2svgfont');
var svg2ttf = require('gulp-svg2ttf');
var ttf2eot = require('gulp-ttf2eot');
var ttf2woff = require('gulp-ttf2woff');
var config = require('./../config');
var runSequence = require('run-sequence');

gulp.task('iconfont', function (callback) {

	if (config.global.tasks.iconfont) {
		runSequence(
			'convertIconsToTtf',
			[
				'convertTtfToEot',
				'convertTtfToWoff'
			],
			callback
		);
	} else {
		callback();
		gutil.log(gutil.colors.yellow('iconfont disabled'));
	}

});

gulp.task('convertIconsToTtf', function () {

	return gulp.src(config.global.src + '/_icons/*.svg')
		.pipe(iconfontCss(config.iconfontCss))
		.pipe(svgicons2svgfont(config.iconfont))
		.pipe(svg2ttf())
		.pipe(gulp.dest(config.global.dev + '/resources/fonts/icons/'));

});

gulp.task('convertTtfToEot', function () {

	return gulp.src(config.global.dev + '/resources/fonts/icons/*.ttf')
		.pipe(ttf2eot())
		.pipe(gulp.dest(config.global.dev + '/resources/fonts/icons/'));

});

gulp.task('convertTtfToWoff', function () {

	return gulp.src(config.global.dev + '/resources/fonts/icons/*.ttf')
		.pipe(ttf2woff())
		.pipe(gulp.dest(config.global.dev + '/resources/fonts/icons/'));

});
