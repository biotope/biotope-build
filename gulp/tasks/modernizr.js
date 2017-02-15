var gulp = require('gulp');
var modernizr = require('gulp-modernizr');
var uglify = require('gulp-uglify');
var config = require('./../config');


gulp.task('modernizr', function () {

	return gulp.src([
			config.global.src + '/resources/js/**/*.js',
			config.global.src + '/_mock/configuration.js',
			config.global.dev + '/resources/css/**/*.css',
			'!' + config.global.src + '/resources/js/vendor/*'
		])
		.pipe(modernizr(config.modernizr))
		.pipe(uglify(config.uglify))
		.pipe(gulp.dest(config.global.dev + '/resources/js/vendor/'));

});
