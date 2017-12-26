const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('htmlhint', function () {

	const sourcePaths = path.join(config.global.cwd, config.global.dev, '*.html');
	return $.gulp.src(sourcePaths)
		.pipe($.cached('htmlhint', { optimizeMemory: true }))
		.pipe($.htmlhint('.htmlhintrc'))
		.pipe($.htmlhint.reporter('htmlhint-stylish'));

});

$.gulp.task('watch:html', function () {

	const sourcePaths = path.join(config.global.cwd, config.global.dev, '*.html');
	$.watch(sourcePaths, config.watch, function () {
		$.runSequence('htmlhint')
	});

});
