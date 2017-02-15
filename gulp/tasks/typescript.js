var gulp = require('gulp');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var mergeStream = require('merge-stream');
var watch = require('gulp-watch');
var cached = require('gulp-cached');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var config = require('./../config');
var tsProject = typescript.createProject('tsconfig.json', config.typescript);


gulp.task('typescript', function () {

	if (config.global.tasks.typescript) {
		return mergeStream(config.global.resources.map(function (currentResource) {
			var tsResult = gulp.src(config.global.src + currentResource + '/ts/**/*.ts')
				.pipe(sourcemaps.init())
				.pipe(tsProject());

			return tsResult
				.js
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(config.global.dev + currentResource + '/ts/'));
		}));
	} else {
		gutil.log(gutil.colors.yellow('typescript disabled'));
	}

});

gulp.task('lint:typescript', function () {

	if (config.global.tasks.typescript) {
		return mergeStream(config.global.resources.map(function (currentResource) {
			return gulp.src(config.global.src + currentResource.replace('/', '') + '/ts/**/*.ts')
				.pipe(cached('ts'))
				.pipe(tslint(config.tslint))
				.pipe(tslint.report({
					emitError: false
				}));
		}));
	}

});

gulp.task('watch:typescript', function () {

	if (config.global.tasks.typescript) {
		config.global.resources.forEach(function (currentResource) {
			watch([
				config.global.src + currentResource + '/ts/**/*.ts'
			], function () {
				runSequence(
					['lint:typescript'],
					['typescript']
				);
			});
		});
	}

});
