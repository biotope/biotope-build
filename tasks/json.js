const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('lint:json', function () {

	if (config.global.tasks.linting) {
		const sourcePaths = path.join(config.global.cwd, config.global.src, '**', '*.json');

		return $.gulp.src(sourcePaths)
			.pipe($.cached('json', { optimizeMemory: true }))
			.pipe($.jsonlint())
			.pipe($.jsonlint.reporter());
	} else {
		console.log($.colors.yellow('linting json disabled'));
	}
});

$.gulp.task('watch:json', function () {

	if (config.global.tasks.linting) {
		const sourcePaths = path.join(config.global.cwd, config.global.src, '**', '*.json');

		$.watch(sourcePaths, config.watch, function () {
			$.runSequence('lint:json');
		});
	}
});
