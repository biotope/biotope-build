const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('image:resources:dist', function () {

	if (config.global.tasks.image) {
		const imageOptimizers = [
			$.imagemin.gifsicle(),
			$.imagemin.jpegtran(),
			$.imagemin.optipng(),
			$.imagemin.svgo()
		];

		return $.mergeStream(config.global.resources.map( function(currentResource) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.dist, currentResource, 'img', '**', '*.*'),
				'!**/*.md'
			];
			const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'img');

			return $.gulp.src(sourcePaths)
				.pipe($.imagemin(
					imageOptimizers,
					config.image
				))
				.pipe($.gulp.dest(targetPath));
		}));

	} else {
		console.log($.colors.yellow('image compressor disabled'));
	}
});

$.gulp.task('image:component:dist', function () {

	if (config.global.tasks.image) {
		const imageOptimizers = [
			$.imagemin.gifsicle(),
			$.imagemin.jpegtran(),
			$.imagemin.optipng(),
			$.imagemin.svgo()
		];

		return $.mergeStream(config.global.resources.map(function (currentResource) {
			return $.mergeStream(config.global.components.map(function (currentComponent) {

				const sourcePaths = path.join(config.global.cwd, config.global.src, currentComponent, '*', 'img', '**', '*.*');
				const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, currentComponent);

				return $.gulp.src(sourcePaths)
					.pipe($.imagemin(
						imageOptimizers,
						config.image
					))
					.pipe($.gulp.dest(targetPath));
			}));
		}));
	}
});
