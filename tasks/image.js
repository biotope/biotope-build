const gulp = require('gulp');
const config = require('./../config');
const {
	getComponentPathDist
} = require('../helper/getComponentPath');

gulp.task('image:resources:dist', function () {

	if (config.global.tasks.image) {
		const path = require('path');
		const image = require('gulp-imagemin');
		const imageOptimizers = [
			image.gifsicle(),
			image.jpegtran(),
			image.optipng()
		];

		return gulp.src([
			path.join(config.global.dist, config.global.resources, 'img', '**', '*.*'),
			'!' + path.join(config.global.dist, config.global.resources, 'img', '**', '*.svg')
		])
			.pipe(image(
				imageOptimizers,
				config.image
			))
			.pipe(gulp.dest(
				path.join(config.global.dist, config.global.resources, 'img')
			));

	} else {
		const colors = require('colors/safe');
		console.log(colors.yellow('image compressor disabled'));
	}
});

gulp.task('image:component:dist', function () {

	if (config.global.tasks.image) {
		const path = require('path');
		const image = require('gulp-imagemin');
		const imageOptimizers = [
			image.gifsicle(),
			image.jpegtran(),
			image.optipng()
		];

		return gulp.src([
				path.join(getComponentPathDist(), '**', 'img', '**', '*.*'),
				'!' + path.join(getComponentPathDist(), '**', 'img', '**', '*.svg')
			])
			.pipe(image(
				imageOptimizers,
				config.image
			))
			.pipe(gulp.dest(
				path.join(getComponentPathDist())
			));

	}
});
