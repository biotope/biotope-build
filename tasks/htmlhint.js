const config = require('./../config');
const $ = config.plugins;

$.gulp.task('htmlhint', function () {

	return $.gulp.src(config.global.dev + '/*.html')
		.pipe($.cached('htmlhint', { optimizeMemory: true }))
		.pipe($.htmlhint('.htmlhintrc'))
		.pipe($.htmlhint.reporter('htmlhint-stylish'));

});

$.gulp.task('watch:html', function () {

	$.watch([
		config.global.dev + '/*.html'
	], config.watch, function () {
		$.runSequence('htmlhint')
	});

});
