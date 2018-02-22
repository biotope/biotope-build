const gulp = require('gulp');
const config = require('./../config');

gulp.task('clean:dev', function () {
	const del = require('del');
	return del([
		config.global.dev + '/**/*'
	]);
});

gulp.task('clean:dist', function () {
	const del = require('del');
	return del([
		config.global.dist + '/**/*'
	]);
});

gulp.task('clean:useref', function () {
	const del = require('del');
	return del([
		config.global.dist + '/_useref.html'
	]);
});

gulp.task('clean:iconfont', function () {
	const del = require('del');
	return del([
		'./iconfont'
	]);
});
