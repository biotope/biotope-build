const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('copy:dev:js', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, currentResource, 'js', '**', '*.js');
		const targetPath = path.join(config.global.cwd, config.global.dev, currentResource, 'js');

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('copy:dev:components:js', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource, index) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, config.global.components[index], '**', '*.js');
		const targetPath = path.join(config.global.cwd, config.global.dev, currentResource, config.global.components[index]);

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('copy:dist:js', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.dev, currentResource, 'js', '**', '*.js');
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'js');

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('copy:dist:ts', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.dev, currentResource, 'ts', '*.js');
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'ts');

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('copy:dev:npm:js', function () {
	const resources = config.global.externalResources;
	if (Object.keys(resources).length === 0 && resources.constructor === Object) return;

	return $.mergeStream(config.global.resources.map( function(currentResource) {
		return $.mergeStream(Object.keys(resources).map(function(key) {
			if( typeof resources[key] === 'string' ) {
				resources[key] = [resources[key]];
			}

			return $.mergeStream(resources[key].map(function(file) {

				const sourcePaths = path.join(config.global.cwd, config.global.node, key, file);
				const targetPath = path.join(config.global.cwd, config.global.dev, currentResource, 'js', 'vendor');

				return $.gulp.src(sourcePaths)
					.pipe($.filter('*.js'))
					.pipe($.gulp.dest(targetPath));
			}));
		}));

	}));
});

$.gulp.task('copy:dev:npm:css', function () {
	const resources = config.global.externalResources;
	if (Object.keys(resources).length === 0 && resources.constructor === Object) return;

	return $.mergeStream(config.global.resources.map( function(currentResource) {
		return $.mergeStream(Object.keys(resources).map(function(key, index) {
			if( typeof resources[key] === 'string' ) {
				resources[key] = [resources[key]];
			}

			return $.mergeStream(resources[key].map(function(file) {

				const sourcePaths = path.join(config.global.cwd, config.global.node, key, file);
				const targetPath = path.join(config.global.cwd, config.global.dev, currentResource, 'css', 'vendor');

				return $.gulp.src(sourcePaths)
					.pipe($.filter(['*.css', '*.scss']))
					.pipe($.gulp.dest(targetPath));
			}));
		}));

	}));
});

/**
 * backwards compatibility for bower components
 * dev copy task
 */
$.gulp.task('copy:dev:npm:bower', function () {
	let object = config.global.bowerResources;

	if (Object.keys(object).length === 0 && object.constructor === Object) return;

	return $.mergeStream(config.global.resources.map( function(currentResource) {
		return $.mergeStream(Object.keys(object).map(function(key) {
			if( typeof object[key] === 'string' ) {
				object[key] = [object [key]];
			}

			return $.mergeStream(object[key].map(function(file) {
				let paths = file.split('/');
				paths.pop();

				const sourcePaths = path.join(config.global.cwd, config.global.node, key, file);
				const targetPath = path.join(config.global.cwd, config.global.dev, currentResource, 'bower_components', key, ...paths);

				return $.gulp.src(sourcePaths)
					.pipe($.gulp.dest(targetPath));
			}));
		}));
	}));
});

/**
 * backwards compatibility for bower
 * dist copy task
 */
$.gulp.task('copy:dist:bower', function () {

	const sourcePaths = path.join(config.global.cwd, config.global.dev, 'resources', 'bower_components', '**', '*',);
	const targetPath = path.join(config.global.cwd, config.global.dist, 'resources', 'bower_components');

	return $.gulp.src(sourcePaths)
		.pipe($.gulp.dest(targetPath));

});

$.gulp.task('copy:dist:flash', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, currentResource, 'flash', '**', '*',);
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'flash');

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('copy:dist:json', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, currentResource, 'json', '**', '*',);
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'json');

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('copy:dist:fonts', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource) {

		const sourcePaths = [
			path.join(config.global.cwd, config.global.src, currentResource, 'fonts', '**', '*',),
			path.join(config.global.cwd, config.global.dev, currentResource, 'fonts', '**', '*',)
		];
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'fonts');

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('copy:dist:img', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, currentResource, 'img', '**', '*',);
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'img');

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('copy:dist:assets', function () {

	const sourcePaths = path.join(config.global.cwd, config.global.src, '_assets', '**', '*',);
	const targetPath = path.join(config.global.cwd, config.global.dist, '_assets');

	return $.gulp.src(sourcePaths)
		.pipe($.gulp.dest(targetPath));

});

$.gulp.task('copy:dist:css', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, currentResource, 'css', '**', '*.css',);
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'css');

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('copy:dist:mock', function () {

	const sourcePaths = path.join(config.global.cwd, config.global.src, '_mock', '**', '*',);
	const targetPath = path.join(config.global.cwd, config.global.dist, '_mock');

	return $.gulp.src(sourcePaths)
		.pipe($.gulp.dest(targetPath));

});

$.gulp.task('copy:dist:config', function () {

	const sourcePaths = path.join(config.global.cwd, config.global.src, '_config', '**', '*',);
	const targetPath = path.join(config.global.cwd, config.global.dist, '_config');

	return $.gulp.src(sourcePaths)
		.pipe($.gulp.dest(targetPath));

});

$.gulp.task('copy:dist:hbs', function () {

	return $.mergeStream(config.global.resources.map( function(currentResource) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, currentResource, 'templates', '**', '*',);
		const targetPath = path.join(config.global.cwd, config.global.dist, currentResource, 'templates');

		return $.gulp.src(sourcePaths)
			.pipe($.gulp.dest(targetPath));
	}));

});

$.gulp.task('watch:components:js', function() {
	config.global.components.forEach(function(currentComponent) {

		const sourcePaths = path.join(config.global.cwd, config.global.src, currentComponent, '**', '*.js',);

		$.watch(sourcePaths, config.watch, function () {
			$.runSequence(
				['copy:dev:components:js']
			);
		});
	});
});
