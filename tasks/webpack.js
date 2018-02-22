const gulp = require('gulp');
const named = require('vinyl-named');
const mergeStream = require('merge-stream');
const path = require('path');
const watch = require('gulp-watch');
const colors = require('colors/safe');
const runSequence = require('run-sequence');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const webpackConfig = require('./../webpack.config.js');
const config = require('./../config');

gulp.task('webpack:ts', function() {
	if (config.global.tasks.webpack) {
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
		console.log(colors.yellow('webpack:ts disabled'));
	}
});

gulp.task('watch:webpack:ts', function () {
	if (config.global.tasks.webpack) {
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
