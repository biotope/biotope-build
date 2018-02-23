const gulp = require('gulp');
const config = require('./../config');

const cleanCssTask = (source, target) => {
	const size = require('gulp-size');
	const cleanCss = require('gulp-clean-css');
	const stream = gulp.src(source);

	if (config.global.tasks.cleanCss) {
		stream.pipe(cleanCss(config.cleanCss))
			.pipe(size({
				title: 'minified',
				showFiles: true
			}));
	} else {
		const colors = require('colors/safe');
		console.log(colors.yellow('cleanCss disabled'));
	}

	stream.pipe(gulp.dest(target));
	return stream;
};


gulp.task('cleanCss:resources:dist', function () {
	return cleanCssTask(
		config.global.dev + config.global.resources + '/css/**/*.css',
		config.global.dist + config.global.resources + '/css/'
	);
});

gulp.task('cleanCss:components:dist', function () {
	return cleanCssTask(
		config.global.dev + config.global.resources + config.global.components + '/**/*.css',
		config.global.dist + config.global.resources + config.global.components
	);
});
