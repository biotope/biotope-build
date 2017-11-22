const gulp = require('gulp');
const gutil = require('gulp-util');
const iconfontCss = require('gulp-iconfont-css');
const svgicons2svgfont = require('gulp-svgicons2svgfont');
const svg2ttf = require('gulp-svg2ttf');
const ttf2eot = require('gulp-ttf2eot');
const ttf2woff = require('gulp-ttf2woff');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');
const mergeStream = require('merge-stream');

const config = require('./../config');

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

	let iconfontArray = config.iconfontCss;

	if (!Array.isArray(iconfontArray)) {
		iconfontArray = [iconfontArray];
	}

	return mergeStream(iconfontArray.map(function(currentIconResource) {
		return mergeStream(config.global.resources.map( function(currentResource, index) {
			return gulp.src(config.global.src + currentResource + '/icons/*.svg')
				.pipe(iconfontCss(currentIconResource))
				.pipe(svgicons2svgfont(config.iconfont))
				.pipe(svg2ttf())
				.pipe(gulp.dest(config.global.dev + currentResource + '/fonts/icons/'));
		}));
	}));

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

gulp.task('watch:icons', function() {

	config.global.resources.map( function(currentResource) {

		return watch(config.global.src + currentResource + '/icons/*.svg', config.watch, function () {
			runSequence(
				'iconfont',
				[
					'static:hb',
					'resources:sass'
				]
			);
		});
	});

});
