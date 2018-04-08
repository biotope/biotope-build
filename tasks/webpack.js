const gulp = require('gulp');
const config = require('./../config');
const path = require('path');
const webpackSourcePatterns = [
    path.join(config.global.src, config.global.resources, '**', '*.ts'),
    path.join(config.global.src, config.global.components, '**', '*.ts')
];

gulp.task('webpack:ts', (cb) => {
	if (config.global.tasks.webpack) {

        const pump = require('pump');
		const webpackConfig = require('./../pumps/webpack');
		const webpackTask = webpackConfig.defaultPump(config);

		config.webpack.ignoreList.forEach((ignorePath) => {
            webpackSourcePatterns.push('!' + path.join(config.global.src, ignorePath));
		});

		webpackTask.unshift(gulp.src(webpackSourcePatterns, { base: path.join(config.global.cwd, config.global.src) }));
		webpackTask.push(gulp.dest(config.global.dev));

        pump(webpackTask, cb);

	} else {
		const colors = require('colors/safe');
		console.log(colors.yellow('webpack:ts disabled'));
		cb();
	}
});

gulp.task('watch:webpack:ts', function () {
	if (config.global.tasks.webpack) {
		const watch = require('gulp-watch');
		const runSequence = require('run-sequence');

		watch(webpackSourcePatterns, config.watch, function () {
			runSequence('webpack:ts', 'livereload');
		});
	}
});
