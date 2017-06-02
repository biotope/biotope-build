var gulp = require('gulp');
var connect = require('gulp-connect');
var opn = require('opn');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var config = require('./../config');


gulp.task('livereload', function () {

    return watch([
        config.global.dev + '/**/*',
        config.global.src + '/resources/js/**/*.js',
        config.global.src + '/resources/bower_components/**/*',
        config.global.src + '/_mock/**/*',
        config.global.src + '/_assets/**/*',
        '!' + config.global.dev + '/_mock/**/*',
        '!' + config.global.dev + '/_assets/**/*',
        '!' + config.global.dev + '/resources/js/vendor/**/*.js',
        '!' + config.global.dev + '/resources/bower_components/**/*',
        '!' + config.global.dev + '/resources/js/handlebars.templates.js'
    ], { ignoreInitial: true })
        .pipe(cached('livereload'))
        .pipe(gulpLivereload());

});

gulp.task('connect:open', function () {

	return opn('http://localhost:' + config.connect.port);

});

gulp.task('connect', function () {

    connect.server({
        root: [config.global.dev, config.global.src],
		port: config.connect.port,
        livereload: config.livereload
    });

});

