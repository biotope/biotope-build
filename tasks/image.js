const gulp = require('gulp');
const config = require('./../config');

gulp.task('image:resources:dist', function () {

	if (config.global.tasks.image) {
		const image = require('gulp-imagemin');
		const imageOptimizers = [
			image.gifsicle(),
			image.jpegtran(),
			image.optipng(),
			image.svgo()
		];

		return gulp.src(config.global.dist + config.global.resources + '/img/**/*.*')
			.pipe(image(
				imageOptimizers,
				config.image
			))
			.pipe(gulp.dest(config.global.dist + config.global.resources + '/img/'));

	} else {
		const colors = require('colors/safe');
		console.log(colors.yellow('image compressor disabled'));
	}
});

gulp.task('image:component:dist', function () {

	if (config.global.tasks.image) {
		const image = require('gulp-imagemin');
		const imageOptimizers = [
			image.gifsicle(),
			image.jpegtran(),
			image.optipng(),
			image.svgo()
		];

		return gulp.src(config.global.src + config.global.components + '/*/img/**/*.*')
			.pipe(image(
				imageOptimizers,
				config.image
			))
			.pipe(gulp.dest(config.global.dist + config.global.resources + config.global.components));

	}
});
