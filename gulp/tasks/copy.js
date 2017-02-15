var gulp = require('gulp');
var mergeStream = require('merge-stream');
var config = require('./../config');

gulp.task('copy:dev:js', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/js/*.js')
			.pipe(gulp.dest(config.global.dev + currentResource + '/js/'));
	}));

});

gulp.task('copy:dev:js:vendor', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/js/vendor/**/*')
			.pipe(gulp.dest(config.global.dev + currentResource + '/js/vendor/'));
	}));

});

gulp.task('copy:dist:js:vendor', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.dev + currentResource + '/js/vendor/**/*')
			.pipe(gulp.dest(config.global.dist + currentResource + '/js/vendor/'));
	}));

});

gulp.task('copy:dist:flash', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/flash/**/*')
			.pipe(gulp.dest(config.global.dist + currentResource + '/flash/'));
	}));

});

gulp.task('copy:dist:json', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/json/**/*')
			.pipe(gulp.dest(config.global.dist + currentResource + '/json/'));
	}));

});

gulp.task('copy:dist:fonts', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src([
			config.global.src + currentResource + '/fonts/**/*',
			config.global.dev + currentResource + '/fonts/**/*'
		])
			.pipe(gulp.dest(config.global.dist + currentResource + '/fonts/'));
	}));

});

gulp.task('copy:dist:img', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/img/**/*')
			.pipe(gulp.dest(config.global.dist + currentResource +  '/img/'));
	}));

});

gulp.task('copy:dist:assets', function () {

	return gulp.src(config.global.src + '/_assets/**/*')
		.pipe(gulp.dest(config.global.dist + '/_assets/'));

});

gulp.task('copy:dist:css', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/css/**/*.css')
			.pipe(gulp.dest(config.global.dist + currentResource + '/css/'));
	}));

});

gulp.task('copy:dist:mock', function () {

	return gulp.src(config.global.src + '/_mock/**/*')
		.pipe(gulp.dest(config.global.dist + '/_mock/'));

});

gulp.task('copy:dist:hbs', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/templates/**/*')
			.pipe(gulp.dest(config.global.dist + currentResource + '/templates/'));
	}));

});
