const gulp = require('gulp');
const config = require('./../config');

gulp.task('iconfont', function (callback) {
	const runSequence = require('run-sequence');

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
		const colors = require('colors/safe');
		console.log(colors.yellow('iconfont disabled'));

		callback();
	}
});

gulp.task('convertIconsToTtf', function () {
	const mergeStream = require('merge-stream');
	const iconfontCss = require('gulp-iconfont-css');
	const svgicons2svgfont = require('gulp-svgicons2svgfont');
	const svg2ttf = require('gulp-svg2ttf');

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
	const ttf2eot = require('gulp-ttf2eot');

	return gulp.src(config.global.dev + '/resources/fonts/icons/*.ttf')
		.pipe(ttf2eot())
		.pipe(gulp.dest(config.global.dev + '/resources/fonts/icons/'));
});

gulp.task('convertTtfToWoff', function () {
	const ttf2woff = require('gulp-ttf2woff');

	return gulp.src(config.global.dev + '/resources/fonts/icons/*.ttf')
		.pipe(ttf2woff())
		.pipe(gulp.dest(config.global.dev + '/resources/fonts/icons/'));
});

gulp.task('watch:icons', function() {
	const watch = require('gulp-watch');
	const runSequence = require('run-sequence');

	watch(config.global.src + config.global.resources + '/icons/*.svg', config.watch, function () {
		runSequence(
			'iconfont',
			[
				'static:hb',
				'resources:sass'
			],
			['livereload']
		);
	});
});
