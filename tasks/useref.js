const gulp = require('gulp');
const useref = require('gulp-useref');
const hb = require('gulp-hb');
const filter = require('gulp-filter');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const lec = require('gulp-line-ending-corrector');

const config = require('./../config');

gulp.task('useref', function () {

	return gulp.src(config.global.dev + '/*.html')
		.pipe(lec(config.lec))
		.pipe(useref({
			noAssets: true
		}))
		.pipe(filter(['**/*.html']))
		.pipe(gulp.dest(config.global.dist));

});

gulp.task('useref:assets', function () {

	const jsFilter = filter(['**/*.js'], {restore: true});
	const cssFilter = filter(['**/*.css'], {restore: true});

	let hbStream = hb().partials(config.global.src + '/**/*.hbs');

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
