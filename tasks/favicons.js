const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('favicons', function () {
	if (config.global.tasks.favicons) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, 'resources', 'favicon.png');
		const targetPath = path.join(config.global.cwd, config.global.dist, 'favicons');

		return $.gulp.src(sourcePaths)
			.pipe($.favicons(config.favicons))
			.pipe($.gulp.dest(targetPath));
	}
});

