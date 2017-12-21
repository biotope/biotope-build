const config = require('./../config');
const $ = config.plugins;

$.gulp.task('watch:livereload', function () {

	$.watch(config.connect.globs, config.watch, function() {
		$.runSequence(
			['livereload']
		);
	});

	return $.gulp.src(config.connect.globs)
		.pipe($.cached('livereload', { optimizeMemory: true }));

});

$.gulp.task('livereload', function () {

	return $.gulp.src(config.connect.globs)
		.pipe($.cached('livereload', { optimizeMemory: true }))
		.pipe($.connect.reload());

});

$.gulp.task('connect:open', function () {

	return $.opn('http://localhost:' + config.connect.port);

});

$.gulp.task('connect', function () {

	$.connect.server({
		root: [
			config.global.dev,
			config.global.src
		],
		port: config.connect.port,
		livereload: config.livereload
	});

});

