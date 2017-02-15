var gulp = require('gulp');
var image = require('gulp-image');
var gutil = require('gulp-util');
var config = require('./../config');


gulp.task('image:dist', function () {

	if (config.global.tasks.image) {
		return gulp.src(config.global.dist + '/resources/img/**/*')
			.pipe(image(config.image))
			.pipe(gulp.dest(config.global.dist + '/resources/img/'));
	} else {
		gutil.log(gutil.colors.yellow('image compressor disabled'));
	}
});
