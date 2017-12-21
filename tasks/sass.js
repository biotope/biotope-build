const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('resources:sass', function () {
	if (config.global.tasks.sass) {
		return $.mergeStream(config.global.resources.map(function(currentResource) {

			return $.gulp.src([
				path.join(config.global.src, currentResource, 'scss', '**/*.scss'),
				'!' + path.join(config.global.src, currentResource, 'scss', '**/_*.scss')
			])
				.pipe($.sourcemaps.init())
				.pipe($.sass(config.sass).on('error', $.sass.logError))
				.pipe($.postcss([
					$.autoprefixer(config.autoprefixer)
				]))
				.pipe($.sourcemaps.write('.'))
				.pipe($.gulp.dest(config.global.dev + currentResource + '/css'));

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
		return $.mergeStream(config.global.resources.map(function (currentResource, index) {
			return $.gulp.src([
				config.global.src + config.global.components[index] + '/**/*.scss',
				'!' + config.global.src + config.global.components[index] + '/**/_*.scss'
			])
				.pipe($.sourcemaps.init())
				.pipe($.sass(config.sass).on('error', $.sass.logError))
				.pipe($.postcss([
					$.autoprefixer(config.autoprefixer)
				]))
				.pipe($.sourcemaps.write('.'))
				.pipe($.gulp.dest(config.global.dev + currentResource + config.global.components[index]));
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
			return $.gulp.src([config.global.src + currentResource + '/scss/**/*.s+(a|c)ss',
				'!' + config.global.src + currentResource + '/scss/**/_icons.s+(a|c)ss',
			])
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
			return $.gulp.src(config.global.src + currentComponent + '/**/*.s+(a|c)ss')
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
			$.watch([
				config.global.src + currentResource + '/scss/**/*.scss'
			], config.watch, function() {
				$.runSequence(
					['lint:resources:sass'],
					['resources:sass']
				);
			});
		});

		$.watch([
			config.global.src + '../.iconfont' + '/*.scss'
		], config.watch, function() {
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
		let components = [];
		config.global.components.map( function(currentComponent) {
			components.push(config.global.src + currentComponent + '/**/*.scss');
		});

		$.watch(components, config.watch, function() {
			$.runSequence(
				['lint:components:sass'],
				['components:sass']
			);
		});
	}
});
