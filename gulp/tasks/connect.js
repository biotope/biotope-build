var gulp = require('gulp');
var connect = require('gulp-connect');
var opn = require('opn');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var config = require('./../config');

gulp.task('livereload:init', function () {

    return gulp.src(config.connect.globs)
        .pipe(cached('livereload'));

});

gulp.task('livereload', function () {

    watch(config.connect.globs)
        .pipe(cached('livereload'))
        .pipe(connect.reload());

});

gulp.task('connect:open', function () {

	opn('http://localhost:' + config.connect.port);

});

gulp.task('connect', function () {

    connect.server({
        root: [
            config.global.dev,
            config.global.src
        ],
		port: config.connect.port,
        livereload: config.livereload
    });

});

