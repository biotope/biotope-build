const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('inject', function () {
	if (config.global.tasks.favicons) {

		const htmlSourcePaths = path.join(config.global.cwd, config.global.dist, '*.html');
		const favionsSourcePaths = path.join(config.global.cwd, config.global.dist, 'favicons', 'htmlhead.favicons.html');
		const targetPath = path.join(config.global.cwd, config.global.dist);

		return $.gulp.src(htmlSourcePaths)
			.pipe($.inject($.gulp.src(favionsSourcePaths), {
				starttag: '<!-- inject:head:{{ext}} -->',
				transform: function (filePath, file) {
					// return file contents as string
					return file.contents.toString('utf8')
				}
			}))
			.pipe($.gulp.dest(targetPath));
	}
});
