const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('uglify:resources:dist', function (cb) {

	if (config.global.tasks.uglify) {

		config.global.resources.forEach((resource) => {
			config.uglify.folders.forEach((folder) => {

				const sourcePaths = [
					path.join(config.global.cwd, config.global.dev, resource, folder, '**', '*.js')
				];

				config.uglify.ignoreList.forEach(function (ignorePath) {
					sourcePaths.push('!' + path.join(config.global.cwd, config.global.dev, ignorePath));
				});

				$.pump([
					$.gulp.src(sourcePaths),
					config.uglify.sourcemaps ? $.sourcemaps.init() : $.noop(),
					$.uglify(),
					$.size({ title: 'uglified', showFiles: true }),
					config.uglify.sourcemaps ? $.sourcemaps.write() : $.noop(),
					$.gulp.dest( path.join(config.global.cwd, config.global.dist, resource, folder) )
				]);

			});
		});

		cb();

	} else {
		console.log($.colors.yellow('uglify resources disabled'));
	}
});


$.gulp.task('uglify:components:dist', function (cb) {

	if (config.global.tasks.uglify) {

		config.global.resources.forEach((resource, index) => {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.dev, resource, config.global.components[index], '**', '*.js')
			];

			config.uglify.ignoreList.forEach(function (ignorePath) {
				sourcePaths.push('!' + path.join(config.global.cwd, config.global.dev, ignorePath));
			});

			$.pump([
				$.gulp.src(sourcePaths),
				config.uglify.sourcemaps ? $.sourcemaps.init() : $.noop(),
				$.uglify(),
				$.size({ title: 'uglified', showFiles: true }),
				config.uglify.sourcemaps ? $.sourcemaps.write() : $.noop(),
				$.gulp.dest( path.join(config.global.cwd, config.global.dist, resource, config.global.components[index]) )
			]);

		});

		cb();

	} else {
		console.log($.colors.yellow('uglify components disabled'));
	}
});
