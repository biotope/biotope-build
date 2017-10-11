var gulp = require('gulp');
var hb = require('gulp-hb');
var fs = require('fs');
var globule = require('globule');
var path = require('path');
var replace = require('gulp-replace');
var mergeStream = require('merge-stream');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var handlebars = require('handlebars');
var config = require('./../config');

require.extensions['.html'] = function (module, filename) {
	module.exports = handlebars.compile(fs.readFileSync(filename, 'utf8'));
};

gulp.task('static:hb', function () {

	let hbStream = hb({
		debug: true
	})
	// handlebar helper functions
		.helpers({
			def: function (a, b) { return a ? a : b; }
		})
		// global partials
		.partials('./app/_partials/**/*.{html,handlebars,hbs}');

	// component partials
	config.global.components.map( function(currentComponent, index) {
		hbStream
			.partials('./app' + currentComponent + '/**/*.{html,handlebars,hbs}');
	});

	/**
	 * reads from _pages
	 * puts files to .tmp
	 */
	return gulp
		.src('./app/_pages/' + '/*.{html,handlebars,hbs}')
		.pipe(replace(
			/\{(?!\{)(.|\n)*?\}/, ''
		))
		.pipe(hbStream)
		.pipe(gulp.dest(config.global.dev));

});


gulp.task('watch:static:hb', function () {

	watch([
		'./app/_partials/**/*.{html,handlebars,hbs}',
		'./app/components/**/*.{html,handlebars,hbs}',
	], function () {
		runSequence(
			['static:hb']
		);
	});

});
