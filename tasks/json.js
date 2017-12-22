const config = require('./../config');
const $ = config.plugins;

$.gulp.task('lint:json', function () {

	if (config.global.tasks.linting) {
		return $.gulp.src(config.global.src + "/**/*.json")
			.pipe($.cached('json', { optimizeMemory: true }))
			.pipe($.jsonlint())
			.pipe($.jsonlint.reporter());
	} else {
		console.log($.colors.yellow('linting json disabled'));
	}
});

$.gulp.task('watch:json', function () {

	if (config.global.tasks.linting) {
		$.watch([
			config.global.src + '/**/*.json'
		], config.watch, function () {
			$.runSequence('lint:json');
		});
	}
});
