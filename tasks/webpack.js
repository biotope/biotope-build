const gulp = require('gulp');
const config = require('./../config');

gulp.task('webpack:ts', function() {
	if (config.global.tasks.webpack) {
		const named = require('vinyl-named');
		const path = require('path');
		const webpack = require('webpack');
		const webpackStream = require('webpack-stream');
		const webpackConfig = require('./../webpack.config.js');
		const srcArray = [
			config.global.src + config.global.resources + '/**/*.ts',
			config.global.src + config.global.components + '/**/*.ts'
		];

		config.webpack.ignoreList.forEach(function (ignorePath) {
			srcArray.push('!' + path.join(config.global.src, ignorePath));
		});

		return gulp.src(srcArray, { base: path.join(config.global.cwd, config.global.src) })
			.pipe(named(function(file) {
				const currentResourceParsed = path.parse(config.global.resources);
				let relativePath = path.relative(file.base, file.path);

				if(!relativePath.startsWith(currentResourceParsed.name)) {
					relativePath = path.join(currentResourceParsed.name, relativePath);
				}

				if(relativePath.endsWith('.ts')) {
					relativePath = relativePath.slice(0, -3);
				}

				return relativePath;
			}))
			.pipe(webpackStream(webpackConfig, webpack).on('error', function() {
				this.emit('end');
			}))
			.pipe(gulp.dest(config.global.dev));


	} else {
		const colors = require('colors/safe');
		console.log(colors.yellow('webpack:ts disabled'));
	}
});

gulp.task('watch:webpack:ts', function () {
	if (config.global.tasks.webpack) {
		const watch = require('gulp-watch');
		const runSequence = require('run-sequence');

		watch([
			config.global.src + config.global.resources + '/**/*.ts',
			config.global.src + config.global.components + '/**/*.ts'
		], config.watch, function () {
			runSequence(
				['webpack:ts'],
				['livereload']
			);
		});
	}
});
