const config = require('./../config');
const $ = config.plugins;

$.gulp.task("favicons", function () {
	if (config.global.tasks.favicons) {
		return $.gulp.src(config.global.src + '/resources/favicon.png')
			.pipe($.favicons(config.favicons))
			.pipe($.gulp.dest(config.global.dist + '/favicons/'));
	}
});

