const gulp = require('gulp');
const connect = require('gulp-connect');
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
	const cached = require('gulp-cached');

	return gulp.src(config.connect.globs)
		.pipe(cached('livereload', {optimizeMemory: true}))
		.pipe(connect.reload());
});

gulp.task('connect:open', function () {
	const opn = require('opn');
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

