const gulp = require('gulp');
const config = require('./../config');

gulp.task('useref', function () {
	const useref = require('gulp-useref');
	const lec = require('gulp-line-ending-corrector');
	const filter = require('gulp-filter');

	return gulp.src(config.global.dev + '/*.html')
		.pipe(lec(config.lec))
		.pipe(useref({
			noAssets: true
		}))
		.pipe(filter(['**/*.html']))
		.pipe(gulp.dest(config.global.dist));

});

gulp.task('useref:assets', function () {
	const filter = require('gulp-filter');
	const useref = require('gulp-useref');
	const lec = require('gulp-line-ending-corrector');
	const uglify = require('gulp-uglify');
	const cleanCss = require('gulp-clean-css');

	const jsFilter = filter(['**/*.js'], {restore: true});
	const cssFilter = filter(['**/*.css'], {restore: true});

	const hbsParser = require('./../lib/hbs-parser');
	const hbStream = hbsParser.createHbsGulpStream(
		[
			config.global.src + '/**/*.hbs',
			'!' + config.global.src + '/pages/**'
		],
		null, null, config.global.debug
	);

	return gulp.src(config.global.src + '/resources/_useref.html')
		.pipe(lec(config.lec))
		.pipe(hbStream)
		.pipe(useref())

		.pipe(jsFilter)
		.pipe(uglify(config.uglify))
		.pipe(jsFilter.restore)

		.pipe(cssFilter)
		.pipe(cleanCss(config.cleanCss))
		.pipe(cssFilter.restore)

		.pipe(filter(['**', '!**/_useref.html']))

		.pipe(gulp.dest(config.global.dist));
});
