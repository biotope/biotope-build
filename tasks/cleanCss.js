const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('cleanCss:resources:dist', function () {

	if (!config.global.tasks.cleanCss) {
		console.log($.colors.yellow('cleanCss disabled'));
	}

	return $.mergeStream(config.global.resources.map(function (currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.dev, currentResource, 'css', '**', '*.css');
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'css');

		const stream = $.gulp.src(sourcePaths);

		if (config.global.tasks.cleanCss) {
			const cleanCssPipe = require('../pipes/cleanCss');
			stream.pipe(cleanCssPipe())
				.pipe($.size({
					title: 'minified',
					showFiles: true
				}));
		}

		return stream.pipe($.gulp.dest(targetPath));
	}));
});

$.gulp.task('cleanCss:components:dist', function () {

	if (!config.global.tasks.cleanCss) {
		console.log($.colors.yellow('cleanCss disabled'));
	}

	return $.mergeStream(config.global.resources.map(function (currentResource, index) {

		const sourcePaths = path.join(config.global.cwd, config.global.dev, currentResource, config.global.components[index], '**', '*.css');
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, config.global.components[index]);

		const stream = $.gulp.src(sourcePaths);

		if (config.global.tasks.cleanCss) {
			const cleanCssPipe = require('../pipes/cleanCss');
			stream.pipe(cleanCssPipe());
		}

		return stream.pipe($.gulp.dest(targetPath));
	}));
});
