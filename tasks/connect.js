const gulp = require('gulp');
const connect = require('gulp-connect');
const opn = require('opn');
const cached = require('gulp-cached');
const watch = require('gulp-watch');

const config = require('./../config');

gulp.task('livereload:init', function () {

    return gulp.src(config.connect.globs)
        .pipe(cached('livereload'));

});

gulp.task('livereload', function () {

    return watch(config.connect.globs)
        .pipe(cached('livereload'))
        .pipe(connect.reload());

});

gulp.task('connect:open', function () {

	return opn('http://localhost:' + config.connect.port);

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

