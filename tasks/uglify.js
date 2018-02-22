const gulp = require('gulp');
const size = require('gulp-size');
const path = require('path');
const uglify = require('gulp-uglify');
const colors = require('colors/safe');
const sourcemaps = require('gulp-sourcemaps');
const pump = require('pump');
const noop = require('gulp-noop');

const config = require('./../config');

gulp.task('uglify:resources:dist', function (cb) {

	if (config.global.tasks.uglify) {
		config.uglify.folders.forEach((folder) => {
			const srcArray = [
				path.join(config.global.dev, config.global.resources, folder, '/**/*.js')
			];

			config.uglify.ignoreList.forEach(function (ignorePath) {
				srcArray.push('!' + path.join(config.global.dev, ignorePath));
			});

			pump([
				gulp.src(srcArray),
				config.uglify.sourcemaps ? sourcemaps.init() : noop(),
				uglify(),
				size({ title: 'uglified', showFiles: true }),
				config.uglify.sourcemaps ? sourcemaps.write() : noop(),
				gulp.dest( path.join(config.global.dist, config.global.resources, folder) )
			]);

		});

		cb();

	} else {
		console.log(colors.yellow('uglify resources disabled'));
	}
});


gulp.task('uglify:components:dist', function (cb) {

	if (config.global.tasks.uglify) {
		const srcArray = [
			path.join(config.global.dev, config.global.resources, config.global.components, '/**/*.js')
		];

		config.uglify.ignoreList.forEach(function (ignorePath) {
			srcArray.push('!' + path.join(config.global.dev, ignorePath));
		});

		pump([
			gulp.src(srcArray),
			config.uglify.sourcemaps ? sourcemaps.init() : noop(),
			uglify(),
			size({ title: 'uglified', showFiles: true }),
			config.uglify.sourcemaps ? sourcemaps.write() : noop(),
			gulp.dest( path.join(config.global.dist, config.global.resources, config.global.components) )
		]);


		cb();

	} else {
		console.log(colors.yellow('uglify components disabled'));
	}
})
