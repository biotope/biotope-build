const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('modernizr', function () {

	const sourcePaths = [
		path.join(config.global.cwd, config.global.src, 'resources', 'js', '**', '*.js'),
		path.join(config.global.cwd, config.global.src, 'resources', 'ts', '**', '*.+(t|j)s'),
		path.join(config.global.cwd, config.global.src, 'resources', 'react', '**', '*.+(j|t)sx'),
		path.join(config.global.cwd, config.global.src, '_mock', 'configuration.js'),
		path.join(config.global.cwd, config.global.dev, 'resources', 'css', '**', '*.css'),
		'!' + path.join(config.global.cwd, config.global.src, 'resources', 'js', 'vendor', '**', '*')
	];
	const targetPath = path.join(config.global.cwd, config.global.dev, 'resources', 'js', 'vendor');

	return $.gulp.src(sourcePaths)
		.pipe($.modernizr(config.modernizr))
		.pipe($.uglify(config.uglify))
		.pipe($.gulp.dest(targetPath));
});
