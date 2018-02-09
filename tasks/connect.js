const gulp = require('gulp');
const connect = require('gulp-connect');
const opn = require('opn');
const cached = require('gulp-cached');
// const debug = require('gulp-debug');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

const config = require('./../config');

// gulp.task('watch:livereload', function () {
//
// 	watch(config.connect.globs, config.watch, function () {
// 		runSequence(
// 			['livereload']
// 		);
// 	});
//
// 	return gulp.src(config.connect.globs)
// 		.pipe(cached('livereload', {optimizeMemory: true}));
//
// });

gulp.task('livereload', function () {

	return gulp.src(config.connect.globs)
		.pipe(cached('livereload', {optimizeMemory: true}))
		.pipe(connect.reload());

});

gulp.task('connect:open', function () {

	return opn('http://localhost:' + config.connect.port);

});

gulp.task('connect', function () {

	connect.server({
		root: [
			config.global.dev,
			config.global.src
		],
		port: config.connect.port,
		middleware: function (connect, opt) {
			return [
				function (req, res, next) {
					if(req.method.toUpperCase() === 'POST') {
						req.method = 'GET';
					}
					return next();
				}
			];
		},
		livereload: config.livereload
	});

});

