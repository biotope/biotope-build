const gulp = require('gulp');
const modernizr = require('gulp-modernizr');
const uglify = require('gulp-uglify');

const config = require('./../config');

gulp.task('modernizr', function () {

	return gulp.src([
			config.global.src + '/resources/js/**/*.js',
            config.global.src + '/resources/ts/**/*.+(t|j)s',
            config.global.src + '/resources/react/**/*.+(j|t)sx',
			config.global.src + '/_mock/configuration.js',
			config.global.dev + '/resources/css/**/*.css',
			'!' + config.global.src + '/resources/js/vendor/*'
		])
		.pipe(modernizr(config.modernizr))
		.pipe(uglify(config.uglify))
		.pipe(gulp.dest(config.global.dev + '/resources/js/vendor/'));

});
