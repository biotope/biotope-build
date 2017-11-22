const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');
const mergeStream = require('merge-stream');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

const config = require('./../config');

gulp.task('handlebars', function () {

	if (config.global.tasks.handlebars) {
		// Assume all partials start with an underscore

		const partials = mergeStream(config.global.resources.map( function(currentResource, index) {
			return gulp.src([
				config.global.src + currentResource + '/hbs/**/_*.hbs',
				config.global.src + config.global.components[index] + '/**/hbs/**/_*.hbs',

			])
				.pipe(plumber())
				.pipe(handlebars({
					handlebars: require('handlebars')
				}))
				.pipe(wrap(config.handlebars.partialWrap, {
					processPartialName: function (fileName) {
						// Strip the extension and the underscore
						// Escape the output with JSON.stringify
						return JSON.stringify(path.basename(fileName, '.js').substr(1));
					}
				}, {}));
		}));

		const templates =  mergeStream(config.global.resources.map( function(currentResource, index) {
			return gulp.src([
				config.global.src + currentResource + '/hbs/**/[^_]*.hbs',
				config.global.src + config.global.components[index] + '/**/hbs/**/[^_]*.hbs'
			])
				.pipe(plumber())
				.pipe(handlebars({
					handlebars: require('handlebars')
				}))
				.pipe(wrap(config.handlebars.templateWrap))
				.pipe(declare({
					namespace: config.handlebars.namespace,
					noRedeclare: config.handlebars.noRedeclare
				}));
		}));

		// Output both the partials and the templates
		return mergeStream(partials, templates)
			.pipe(concat('handlebars.templates.js'))
			.pipe(wrap('(function (root, factory) {if (typeof module === \'object\' && module.exports) {module.exports = factory(require(\'handlebars\'));} else {factory(root.Handlebars);}}(this, function (Handlebars) { <%= contents %> }));'))
			.pipe(gulp.dest(config.global.dev + config.global.resources[0] + '/js/'));
	} else {
		gutil.log(gutil.colors.yellow('handlebars disabled'));
	}

});

gulp.task('watch:handlebars', function () {

	if (config.global.tasks.handlebars) {
		let watchFiles = [];
		config.global.resources.forEach(function (currentResource) {
			watchFiles.push(config.global.src + currentResource + '/hbs/**/*.hbs');
			watchFiles.push(config.global.src + currentResource + '/js/handlebars.helper.js');
		});

		config.global.components.forEach(function (currentComponent) {
			watchFiles.push(config.global.src + currentComponent + '/**/hbs/**/*.hbs');
		});

		watch(watchFiles, config.watch, function () {
			runSequence('handlebars');
		});
	} else {
		gutil.log(gutil.colors.yellow('handlebars disabled'));
	}

});
