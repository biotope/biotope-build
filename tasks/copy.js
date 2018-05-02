const gulp = require('gulp');
const config = require('./../config');
const {
	getComponentPathSrc,
	getComponentPathDev,
	getComponentPathDist
} = require('../helper/getComponentPath');




gulp.task('copy:dev:js', function () {
	return gulp.src(config.global.src + config.global.resources + '/js/**/*.js')
		.pipe(gulp.dest(config.global.dev + config.global.resources + '/js/'));
});

gulp.task('copy:dev:components:js', function () {
	return gulp.src(getComponentPathSrc() + '/**/*.js')
		.pipe(gulp.dest(getComponentPathDev()));
});

gulp.task('copy:dist:js', function () {
	return gulp.src(config.global.dev + config.global.resources + '/js/**/*.js')
		.pipe(gulp.dest(config.global.dist + config.global.resources + '/js/'));
});

gulp.task('copy:dist:react', function () {
	return gulp.src(config.global.dev + config.global.resources + '/react/*.js')
		.pipe(gulp.dest(config.global.dist + config.global.resources + '/react/'));
});

gulp.task('copy:dist:ts', function () {
	return gulp.src(config.global.dev + config.global.resources + '/ts/*.js')
		.pipe(gulp.dest(config.global.dist + config.global.resources + '/ts/'));
});

gulp.task('copy:dev:npm:js', function () {
	const mergeStream = require('merge-stream');
	const filter = require('gulp-filter');
	const resources = config.global.externalResources;

	if (Object.keys(resources).length === 0 && resources.constructor === Object) return;

	return mergeStream(Object.keys(resources).map(function(key, index) {
		if (typeof resources[key] === 'string') {
			resources[key] = [resources[key]];
		}

		return mergeStream(resources[key].map(function (file) {
			return gulp.src(config.global.node + '/' + key + '/' + file)
				.pipe(filter('*.js'))
				.pipe(gulp.dest(config.global.dev + config.global.resources + '/js/vendor/'));

		}))

	}));
});

gulp.task('copy:dev:npm:css', function () {
	const mergeStream = require('merge-stream');
	const filter = require('gulp-filter');
	const resources = config.global.externalResources;

	if (Object.keys(resources).length === 0 && resources.constructor === Object) return;

	return mergeStream(Object.keys(resources).map(function(key, index) {
		if (typeof resources[key] === 'string') {
			resources[key] = [resources[key]];
		}

		return mergeStream(resources[key].map(function (file) {
			return gulp.src(config.global.node + '/' + key + '/' + file)
				.pipe(filter('*.css', '*.scss'))
				.pipe(gulp.dest(config.global.dev + config.global.resources + '/css/vendor/'));

		}));
	}));
});

/**
 * backwards compatibility for bower components
 * dev copy task
 */
gulp.task('copy:dev:npm:bower', function () {
	const mergeStream = require('merge-stream');
	const path = require('path');
	let bowerResources = config.global.bowerResources;

	if (Object.keys(bowerResources).length === 0 && bowerResources.constructor === Object) return;

	return mergeStream(Object.keys(bowerResources).map(function(key, index) {
		if( typeof bowerResources[key] === 'string' ) {
			bowerResources[key] = [bowerResources [key]];
		}

		return mergeStream(bowerResources[key].map(function(file) {
			let paths = file.split('/');
			paths.pop();

			let filePath = path.join(key, ...paths);

			return gulp.src(config.global.node + '/' + key + '/' + file)
				.pipe(gulp.dest(config.global.dev + config.global.resources + '/bower_components/' + filePath));
		}));
	}));
});

/**
 * backwards compatibility for bower
 * dist copy task
 */
gulp.task('copy:dist:bower', function () {
	return gulp.src(config.global.dev + '/resources/bower_components/**/*')
		.pipe(gulp.dest(config.global.dist + '/resources/bower_components/'));
});

gulp.task('copy:dist:flash', function () {
	return gulp.src(config.global.src + config.global.resources + '/flash/**/*')
		.pipe(gulp.dest(config.global.dist + config.global.resources + '/flash/'));
});

gulp.task('copy:dist:json', function () {
	return gulp.src(config.global.src + config.global.resources + '/json/**/*')
		.pipe(gulp.dest(config.global.dist + config.global.resources + '/json/'));
});

gulp.task('copy:dist:fonts', function () {
	return gulp.src([
		config.global.src + config.global.resources + '/fonts/**/*',
		config.global.dev + config.global.resources + '/fonts/**/*'
	])
		.pipe(gulp.dest(config.global.dist + config.global.resources + '/fonts/'));
});

gulp.task('copy:dist:resources:img', function () {
	return gulp.src(config.global.src + config.global.resources + '/img/**/*')
		.pipe(gulp.dest(config.global.dist + config.global.resources +  '/img/'));
});

gulp.task('copy:dist:components:img', function () {
	return gulp.src(getComponentPathSrc() + '/**/img/**/*')
		.pipe(gulp.dest(getComponentPathDist()));
});

gulp.task('copy:dist:assets', function () {
	return gulp.src(config.global.src + '/_assets/**/*')
		.pipe(gulp.dest(config.global.dist + '/_assets/'));
});

gulp.task('copy:dist:css', function () {
	return gulp.src(config.global.src + config.global.resources + '/css/**/*.css')
		.pipe(gulp.dest(config.global.dist + config.global.resources + '/css/'));
});

gulp.task('copy:dist:mock', function () {
	return gulp.src(config.global.src + '/_mock/**/*')
		.pipe(gulp.dest(config.global.dist + '/_mock/'));
});

gulp.task('copy:dist:component:mock', function () {
	return gulp.src(getComponentPathSrc() + '/**/_mock/**/*')
		.pipe(gulp.dest(getComponentPathDist()));
});

gulp.task('copy:dist:config', function () {
	return gulp.src(config.global.src + '/_config/**/*')
		.pipe(gulp.dest(config.global.dist + '/_config/'));
});

gulp.task('copy:dist:hbs', function () {
	return gulp.src(config.global.src + config.global.resources + '/templates/**/*')
		.pipe(gulp.dest(config.global.dist + config.global.resources + '/templates/'));
});

gulp.task('watch:components:js', function() {
	const watch = require('gulp-watch');
	const runSequence = require('run-sequence');

	watch(getComponentPathSrc() +'/**/*.js', config.watch, function () {
		runSequence(
			['copy:dev:components:js']
		);
	});
});
