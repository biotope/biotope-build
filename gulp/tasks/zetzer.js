var gulp = require('gulp');
var zetzer = require('gulp-zetzer');
var globule = require('globule');
var fs = require('fs');
var path = require('path');
var notify = require("gulp-notify");
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var config = require('./../config');


gulp.task('zetzer', ['indexr'], function () {

	// Load icons into zetzer environment
	var zetzerConfig = config.zetzer;
	zetzerConfig.env = zetzerConfig.env || {};
	zetzerConfig.env.icons = [];

	var icons = globule.find(config.global.src + '/_icons/*.svg');
	for (var index in icons) {
		var file = path.parse(icons[index]);
		zetzerConfig.env.icons.push(file.name.toLowerCase());
	}

	return gulp.src([
			config.global.src + '/*.html',
			'!' + config.global.src + '/index.html'
		])
		.pipe(zetzer(zetzerConfig))
		.on('error', notify.onError(function (error) {
			return {
				title: 'Zetzer Error',
				message: error.message
			};
		}))
		.pipe(gulp.dest(config.global.dev));

});

gulp.task('indexr', function () {

	var zetzerConfig = config.zetzer;
	zetzerConfig.env = zetzerConfig.env || {};
	zetzerConfig.env.indexr = [];

	// read all files
	var filepaths = globule.find([
		config.global.src + '/_pages/*.html'
	]);

	var lastCategory = '';
	for (var index in filepaths) {
		var template = {};
		template.file = path.parse(filepaths[index]);

		// check current category
		var category = template.file.name.substring(2, template.file.name.indexOf('.'));
		if (lastCategory !== category) {
			lastCategory = category;
			template.category = category;
			template.priority = template.file.name.substring(0, 2);
		}

		var content = fs.readFileSync(filepaths[index], 'utf8');
		var header = {};
		if (/^\{(?!\{)/.test(content)) {
			var match = content.match(/\r?\n\r?\n/);
			header = match ? content.substring(0, match.index) : content;
		}

		try {
			template.data = JSON.parse(header);
		} catch (e) {
		}
		zetzerConfig.env.indexr.push(template);
	}

	gulp.src(config.global.src + '/index.html')
		.pipe(zetzer(config.zetzer))
		.pipe(gulp.dest(config.global.dev));

});


gulp.task('watch:zetzer', function () {

	watch([
		config.global.src + '/*.html',
		config.global.src + '/_partials/**/*.html',
		config.global.src + '/_mock/**/*.json',
		config.global.dev + '/resources/js/handlebars.templates.js'
	], function () {
		runSequence('zetzer');
	});

});
