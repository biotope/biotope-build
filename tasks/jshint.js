const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('jshint:resources', function () {

	if (config.global.tasks.linting) {
		return $.mergeStream(config.global.resources.map(function (currentResource) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, currentResource, 'js', '**', '*.js'),
				'!' + path.join(config.global.cwd, config.global.src, currentResource, 'js', 'vendor', '**', '*.js')
			];

			return $.gulp.src(sourcePaths)
				.pipe($.cached('jshint', { optimizeMemory: true }))
				.pipe($.jshint())
				.pipe($.jshint.reporter($.jshintStylish));
		}));
	} else {
		console.log($.colors.yellow('linting resources disabled'));
	}
});


$.gulp.task('jshint:components', function () {

	if (config.global.tasks.linting) {
		return $.mergeStream(config.global.components.map(function (currentComponent) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, currentComponent, '**', '*.js'),
				'!' + path.join(config.global.cwd, config.global.src, currentComponent, '**', 'vendor', '**', '*.js')
			];

			return $.gulp.src(sourcePaths)
				.pipe($.cached('jshint', { optimizeMemory: true }))
				.pipe($.jshint())
				.pipe($.jshint.reporter($.jshintStylish));
		}));
	} else {
		console.log($.colors.yellow('linting components disabled'));
	}
});

$.gulp.task('watch:jshint:resources', function () {

	if (config.global.tasks.linting) {
		config.global.resources.forEach(function(currentResource) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, currentResource, 'js', '**', '*.js'),
				'!' + path.join(config.global.cwd, config.global.src, currentResource, 'js', 'vendor', '**', '*.js')
			];

			$.watch(sourcePaths, config.watch, function () {
				$.runSequence('jshint:resources');
			});
		});
	}
});

$.gulp.task('watch:jshint:components', function () {

	if (config.global.tasks.linting) {
		config.global.components.forEach(function(currentComponent) {
			$.watch([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			], config.watch, function () {
				$.runSequence('jshint:components');
			});
		});
	}
});
