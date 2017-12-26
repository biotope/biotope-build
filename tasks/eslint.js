const config = require('./../config');
const $ = config.plugins;

$.gulp.task('eslint:resources', function () {

	if (config.global.tasks.linting) {
		return $.mergeStream(config.global.resources.map(function (currentResource) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, currentResource, 'js', '**', '*.js'),
				'!' + path.join(config.global.cwd, config.global.src, currentResource, 'js', 'vendor', '**', '*.js')
			];

			return $.gulp.src(sourcePaths)
				.pipe($.cached('eslint', { optimizeMemory: true }))
				.pipe($.eslint())
				.pipe($.eslint.format())
				.pipe($.eslint.failAfterError());
		}));
	} else {
		console.log($.colors.yellow('linting resources disabled'));
	}
});

$.gulp.task('eslint:components', function () {

	if (config.global.tasks.linting) {
		return $.mergeStream(config.global.components.map(function (currentComponent) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, currentComponent, '**', '*.js'),
				'!' + path.join(config.global.cwd, config.global.src, currentComponent, '**', 'vendor', '**', '*.js')
			];

			return $.gulp.src(sourcePaths)
				.pipe($.cached('eslint', { optimizeMemory: true }))
				.pipe($.eslint())
				.pipe($.eslint.format())
				.pipe($.eslint.failAfterError());
		}));
	} else {
		console.log($.colors.yellow('linting components disabled'));
	}
});

$.gulp.task('watch:eslint:resources', function () {

	if (config.global.tasks.linting) {
		config.global.resources.forEach(function(currentResource) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, currentResource, '**', 'js', '**', '*.js'),
				'!' + path.join(config.global.cwd, config.global.src, currentResource, 'js', 'vendor', '**', '*.js')
			];

			$.watch(sourcePaths, config.watch, function () {
				$.runSequence('eslint:resources')
			});
		});
	}
});

$.gulp.task('watch:eslint:components', function () {

	if (config.global.tasks.linting) {
		config.global.components.forEach(function(currentComponent) {
			$.watch([
				config.global.src + currentComponent + '/**/*.js',
				'!' + config.global.src + currentComponent + '/**/vendor/**/*.js'
			], config.watch, function () {
				$.runSequence('eslint:components')
			});
		});
	}
});
