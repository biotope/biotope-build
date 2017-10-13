var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var mergeStream = require('merge-stream');
var config = require('./../config');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('resources:less', function () {
	if (config.global.tasks.less) {
		return mergeStream(config.global.resources.map(function(currentResource) {
			return gulp.src([
				config.global.src + currentResource + '/less/**/*.less',
				'!' + config.global.src + currentResource + '/less/**/_*.less'
			])
				.pipe(sourcemaps.init())
				.pipe(less(config.less)).on('error', function(err){
					gutil.log(gutil.colors.red('Error (LESS): ' + err.message));
					this.emit('end');
				})
				.pipe(postcss([
					autoprefixer(config.autoprefixer)
				]))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(config.global.dev + currentResource + '/css'));
		}));
	} else {
		gutil.log(gutil.colors.yellow('less disabled'));
	}
});

gulp.task('components:less', function () {
	if (config.global.tasks.less) {
		return mergeStream(config.global.resources.map(function(currentResource, index) {
			return gulp.src([
				config.global.src + config.global.components[index] + '/**/*.less',
				'!' + config.global.src + config.global.components[index] + '/**/_*.less'
			])
				.pipe(sourcemaps.init())
				.pipe(less(config.less)).on('error', function(err){
					gutil.log(gutil.colors.red('Error (LESS): ' + err.message));
					this.emit('end');
				})
				.pipe(postcss([
					autoprefixer(config.autoprefixer)
				]))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(config.global.dev + currentResource + config.global.components[index]));
		}));
	} else {
		gutil.log(gutil.colors.yellow('less disabled'));
	}
});

gulp.task('watch:resources:less', function () {
	if (config.global.tasks.less) {
		config.global.resources.forEach(function(currentResource) {
			watch([
				config.global.src + currentResource + '/less/**/*.less'
			], function() {
				runSequence(['resources:less']);
			});
		});
	}
});

gulp.task('watch:components:less', function () {
	if (config.global.tasks.less) {
		config.global.components.forEach(function(currentComponent) {
			watch([
				config.global.src + currentComponent + '/**/*.less'
			], function() {
				runSequence(['components:less']);
			});
		});
	}
});
