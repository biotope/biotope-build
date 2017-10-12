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
var gutil = require('gulp-util');
var cwd = process.cwd();

require.extensions['.html'] = function (module, filename) {
	module.exports = handlebars.compile(fs.readFileSync(filename, 'utf8'));
};

gulp.task('static:hb', function () {

	//icon data
	let icons = globule.find(config.global.src + '/_icons/*.svg');
	let iconData = {icons: []}
	for (let index in icons) {
		let file = path.parse(icons[index]);
		iconData.icons.push(file.name.toLowerCase());
	}

	let hbStream = hb({
		// set to true to see details to partials, data, etc.
		debug: false
	})
	// handlebar helper functions
		.helpers({
			def: function (a, b) { return a ? a : b; }
		})
		// global partials
		.partials(config.global.src + '/partials/**/*.{html,handlebars,hbs}')
		//data
		.data(iconData)
		.data(config.global.src + '/_mock/**/*.json');

	// component partials
	config.global.components.map( function(currentComponent, index) {
		hbStream
			.partials(config.global.src + currentComponent + '/**/*.{html,handlebars,hbs}');
	});
	// dynamic partials
	config.global.resources.map( function(currentResource, index) {
		hbStream
			.partials(config.global.src + currentResource + '/**/*.hbs');
	});

	/**
	 * reads from pages
	 * puts files to .tmp
	 */
	return gulp
		.src(config.global.src + '/pages/' + '/*.{html,handlebars,hbs}')
		.pipe(hbStream)
		.pipe(gulp.dest(config.global.dev));

});


gulp.task('watch:static:hb', function () {

	watch([
		config.global.src + '/partials/**/*.{html,handlebars,hbs}',

		// @TODO make ready for multiple component folders
		config.global.src + '/components/**/*.{html,handlebars,hbs}',
	], function () {
		runSequence(
			['static:hb']
		);
	});

});


/**
 * indexr creates the preview file index
 */
gulp.task('static:hb:indexr', function () {

	let dataObject = {
		templates: []
	};

	// read all files
	let filepaths = globule.find([
		config.global.src + '/pages/*.html'
	]);

	let lastCategory = '';
	for (let index in filepaths) {
		let content = fs.readFileSync(filepaths[index], 'utf8');
		let data = {};
		let template = {};

		template.file = path.parse(filepaths[index]);

		// check current category
		let category = template.file.name.substring(2, template.file.name.indexOf('.'));
		if (lastCategory !== category) {
			lastCategory = category;
			template.category = category;
			template.priority = template.file.name.substring(0, 2);
		}

		//add template data
		data.template = template;

		//parse content data
		if (/\{\{>/.test(content)) {
			let matches = content.match(/\S*=('|").*('|")/g);

			matches.map(function(match) {
				let elements = match.split('=');
				let key = elements[0];
				let value = elements[1].slice(1, -1);

				data[key] = value
			});
		}
		dataObject.templates.push(data);
	}

	let packageData = {
		package: require(cwd + '/package.json')
	};

	let hbStream = hb({
		// set to true to see details to partials, data, etc.
		debug: false
	})
		.data(dataObject)
		.data(packageData)
		.helpers({
			def: function (a, b) {
				return a ? a : b;
			},
			stringify: function(object) {
				return JSON.stringify(object);
			}
		});

	gulp.src(config.global.src + '/index.html')
		.pipe(hbStream)
		.pipe(gulp.dest(config.global.dev));


});
