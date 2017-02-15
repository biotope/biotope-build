var gulp = require('gulp');
var gutil = require('gulp-util');
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var config = require('./../config');

gulp.task('angularTemplates', function () {

	if (config.global.tasks.angular) {
		return gulp.src([
			config.global.src + '/resources/templates/angular/**/*.html'
		])
			.pipe(htmlmin({removeComments: true}))
			.pipe(templateCache('angular.templates.js', {
				module: 'templateCache',
				standalone: true,
				moduleSystem: 'IIFE'
			}))
			.pipe(gulp.dest(config.global.dev + '/resources/js/'));
	} else {
		gutil.log(gutil.colors.yellow('angular disabled'));
	}

});


gulp.task('watch:angularTemplates', function () {

	if (config.global.tasks.angular) {
		watch([
			config.global.src + '/resources/templates/angular/**/*.html'
		], function () {
			runSequence('angularTemplates')
		});
	} else {
		gutil.log(gutil.colors.yellow('angular disabled'));
	}

});
