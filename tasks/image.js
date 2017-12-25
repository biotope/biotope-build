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
			return $.gulp.src([
				config.global.dist + currentResource + '/img/**/*.*',
				'!**/*.md',
			])
				.pipe($.imagemin(
					imageOptimizers,
					config.image
				))
				.pipe($.gulp.dest(config.global.dist + currentResource + '/img/'));
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
				return $.gulp.src(config.global.src + currentComponent + '/*/img/**/*.*')
					.pipe($.imagemin(
						imageOptimizers,
						config.image
					))
					.pipe($.gulp.dest(config.global.dist + currentResource + currentComponent));
			}));
		}));
	}
});
