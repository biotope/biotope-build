const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('iconfont', function (callback) {

	if (config.global.tasks.iconfont) {
		$.runSequence(
			'convertIconsToTtf',
			[
				'convertTtfToEot',
				'convertTtfToWoff'
			],
			callback
		);
	} else {
		callback();
		console.log($.colors.yellow('iconfont disabled'));
	}

});

$.gulp.task('convertIconsToTtf', function () {

	let iconfontArray = config.iconfontCss;
	if (!Array.isArray(iconfontArray)) {
		iconfontArray = [iconfontArray];
	}

	return $.mergeStream(iconfontArray.map(function(currentIconResource) {
		return $.mergeStream(config.global.resources.map( function(currentResource) {

			const sourcePaths = path.join(config.global.cwd, config.global.src, currentResource, 'icons', '*.svg');
			const targetPath = path.join(config.global.cwd, config.global.dev, currentResource, 'fonts', 'icons');

			return $.gulp.src(sourcePaths)
				.pipe($.iconfontCss(currentIconResource))
				.pipe($.svgicons2svgfont(config.iconfont))
				.pipe($.svg2ttf())
				.pipe($.gulp.dest(targetPath));
		}));
	}));

});

$.gulp.task('convertTtfToEot', function () {

	const sourcePaths = path.join(config.global.cwd, config.global.dev, 'resources', 'fonts', 'icons', '*.ttf');
	const targetPath = path.join(config.global.cwd, config.global.dev, 'resources', 'fonts', 'icons');

	return $.gulp.src(sourcePaths)
		.pipe($.ttf2eot())
		.pipe($.gulp.dest(targetPath));

});

$.gulp.task('convertTtfToWoff', function () {

	const sourcePaths = path.join(config.global.cwd, config.global.dev, 'resources', 'fonts', 'icons', '*.ttf');
	const targetPath = path.join(config.global.cwd, config.global.dev, 'resources', 'fonts', 'icons');

	return $.gulp.src(sourcePaths)
		.pipe($.ttf2woff())
		.pipe($.gulp.dest(targetPath));

});

$.gulp.task('watch:icons', function() {

	config.global.resources.map( function(currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, currentResource, 'icons', '*.svg');

		$.watch(sourcePaths, config.watch, function () {
			$.runSequence(
				'iconfont',
				[
					'static:hb',
					'resources:sass'
				]
			);
		});
	});

});
