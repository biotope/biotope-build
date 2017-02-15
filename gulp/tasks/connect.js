var gulp = require('gulp');
var connect = require('connect');
var connectLivereload = require('connect-livereload');
var opn = require('opn');
var gulpLivereload = require('gulp-livereload');
var serveStatic = require('serve-static');
var cached = require('gulp-cached');
var watch = require('gulp-watch');
var config = require('./../config');


gulp.task('livereload', function () {

	gulpLivereload.listen();
	watch([
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
	], function (file) {
		gulp.src(file.path)
			.pipe(cached('livereload'))
			.pipe(gulpLivereload());

	});

});

gulp.task('connect:open', function () {

	return opn('http://localhost:' + config.connect.port);

});

gulp.task('connect', function () {

	return connect()
		.use(connectLivereload())
		.use(serveStatic(config.global.dev))
		.use(serveStatic(config.global.src))
		.listen(config.connect.port);

});
