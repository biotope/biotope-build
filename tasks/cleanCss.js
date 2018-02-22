const gulp = require('gulp');
const size = require('gulp-size');
const cleanCss = require('gulp-clean-css');
const mergeStream = require('merge-stream');
const colors = require('colors/safe');

const config = require('./../config');

gulp.task('cleanCss:resources:dist', function () {

	if (!config.global.tasks.cleanCss) {
		console.log(colors.yellow('cleanCss disabled'));
	}

	const stream = gulp.src(config.global.dev + config.global.resources + '/css/**/*.css');

	if (config.global.tasks.cleanCss) {
		stream.pipe(cleanCss(config.cleanCss))
			.pipe(size({
				title: 'minified',
				showFiles: true
			}));
	}

	stream.pipe(gulp.dest(config.global.dist + config.global.resources + '/css/'));
	return stream;
});

gulp.task('cleanCss:components:dist', function () {

	if (!config.global.tasks.cleanCss) {
		console.log(colors.yellow('cleanCss disabled'));
	}

	const stream = gulp.src(config.global.dev + config.global.resources + config.global.components + '/**/*.css');

	if (config.global.tasks.cleanCss) {
		stream.pipe(cleanCss(config.cleanCss))
			.pipe(size({
				title: 'minified',
				showFiles: true
			}));
	}

	stream.pipe(gulp.dest(config.global.dist + config.global.resources + config.global.components));
	return stream;
});
