const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('resources:sass', function () {

	if (config.global.tasks.sass) {

		const sassPipe = require('../pipes/sass');
		return $.mergeStream(config.global.resources.map(function(currentResource) {

			const sourcePaths = [
				path.join(config.global.src, currentResource, 'scss', '**', '*.scss'),
				'!' + path.join(config.global.src, currentResource, 'scss', '**', '_*.scss')
			];
			const targetPath = path.join(config.global.cwd, config.global.dev, currentResource, 'css');

			return $.gulp.src(sourcePaths)
				.pipe(sassPipe())
				.pipe($.gulp.dest(targetPath));

		}));
	} else {
		console.log($.colors.yellow('sass resources disabled'));
	}
});

/**
 * compiles scss files
 * from app/partials/components/../
 * to .tmp/resources/components/css/
 */

$.gulp.task('components:sass', function () {
	if (config.global.tasks.sass) {

		const sassPipe = require('../pipes/sass');
		return $.mergeStream(config.global.resources.map(function (currentResource, index) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, config.global.components[index], '**', '*.scss'),
				'!' + path.join(config.global.cwd, config.global.src, config.global.components[index], '**', '_*.scss')
			];
			const targetPath = path.join(config.global.cwd, config.global.dev, currentResource, config.global.components[index]);

			return $.gulp.src(sourcePaths)
				.pipe(sassPipe())
				.pipe($.gulp.dest(targetPath));
		}));
	} else {
		console.log($.colors.yellow('sass components disabled'));
	}
});

/**
 * scss file liniting
 * @TODO throws warnings now, define linting rules
 */
$.gulp.task('lint:resources:sass', function () {
	if (config.global.tasks.sass && config.global.tasks.linting && false) {
		return $.mergeStream(config.global.resources.map(function (currentResource) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, currentResource, 'scss', '**', '*.s+(a|c)ss'),
				'!' + path.join(config.global.cwd, config.global.src, currentResource, 'scss', '**', '_icons.s+(a|c)ss')
			];

			return $.gulp.src(sourcePaths)
				.pipe($.cached('sass', { optimizeMemory: true }))
				.pipe($.sassLint(config.global.sassLint))
				.pipe($.sassLint.format())
				.pipe($.sassLint.failOnError());
		}));
	}
});

$.gulp.task('lint:components:sass', function () {
	if (config.global.tasks.sass && config.global.tasks.linting && false) {
		return $.mergeStream(config.global.components.map(function (currentComponent) {

			const sourcePaths = path.join(config.global.cwd, config.global.src, currentComponent, '**', '*.s+(a|c)ss');

			return $.gulp.src(sourcePaths)
				.pipe($.cached('sass', { optimizeMemory: true }))
				.pipe($.sassLint())
				.pipe($.sassLint.format())
				.pipe($.sassLint.failOnError());
		}));
	}
});

/**
 * watches global scss files for any changes
 */
$.gulp.task('watch:resources:sass', function () {
	if (config.global.tasks.sass) {
		config.global.resources.forEach(function(currentResource) {

			const sourcePaths = path.join(config.global.cwd, config.global.src, currentResource, 'scss', '**', '*.scss');

			$.watch(sourcePaths, config.watch, function() {
				$.runSequence(
					['lint:resources:sass'],
					['resources:sass']
				);
			});
		});

		const sourcePaths = path.join(config.global.cwd, '.iconfont', '*.scss');

		$.watch(sourcePaths, config.watch, function() {
			$.runSequence(
				['lint:resources:sass'],
				['resources:sass']
			);
		});
	}
});

/**
 * watches component scss files for any changes
 */
$.gulp.task('watch:components:sass', function () {
	if (config.global.tasks.sass) {

		const sourcePaths = [];
		config.global.components.map( function(currentComponent) {
			const sourcePath = path.join(config.global.cwd, config.global.src, currentComponent, '**', '*.scss');
			sourcePaths.push(sourcePath);
		});

		$.watch(sourcePaths, config.watch, function() {
			$.runSequence(
				'lint:components:sass',
				'components:sass'
			);
		});
	}
});
