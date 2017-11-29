const gulp = require('gulp');
const frontMatter = require('gulp-front-matter');
const fs = require('fs');
const globule = require('globule');
const notify = require('gulp-notify');
const path = require('path');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');

const config = require('./../config');
const hbsParser = require('./../lib/hbs-parser');
const iconParser = require('./../lib/icon-parser');
const jsonParser = require('./../lib/json-parser');
const packageData = require(config.global.cwd + '/package.json');


gulp.task('static:hb', function () {

	//icon data, only used for demo...
	let iconNames = iconParser.getAllIconFileNamesLowerCase(config.global.src + '/resources/icons/*.svg');
	let preData = {};

	preData[config.global.dataObject] = {
		'icons': iconNames,
		'package': packageData
	};

	let hbsData = jsonParser.getAllJSONData(config.global.src + '/**/*.json', preData[config.global.dataObject]);

	let hbStream = hbsParser.createHbsGulpStream(
		[
			config.global.src + '/**/*.hbs',
			'!' + config.global.src + '/pages/**'
		],
		hbsData, null, config.global.debug
	);

	/**
	 * reads from pages
	 * puts files to .tmp
	 */
	return gulp
		.src(config.global.src + '/pages/**/*.hbs')
		.pipe(frontMatter({
			property: 'data.frontMatter',
			remove: true
		}))
		.pipe(hbStream)
		.on('error', notify.onError(function (error) {
			return {
				title: 'static:hb',
				message: error.message
			};
		}))
		.pipe(rename({extname: ".html"}))
		.pipe(gulp.dest(config.global.dev));

});


gulp.task('watch:static:hb', function () {
	let files = [
		config.global.src + '/**/*.hbs',
		config.global.src + '/**/*.json',
		'!' + config.global.src + '/pages/**'
	];

	watch(files, config.watch, function () {
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
		package: packageData,
		templates: []
	};

	// read all files
	let filepaths = globule.find([
		config.global.src + '/pages/*.hbs'
	]);

	let lastCategory = '';
	for (let index in filepaths) {
		let content = fs.readFileSync(filepaths[index], 'utf8');
		let templateInfo = {};

		templateInfo.file = path.parse(filepaths[index]);

		// check current category
		let category = templateInfo.file.name.substring(2, templateInfo.file.name.indexOf('.'));
		if (lastCategory !== category) {
			lastCategory = category;
			templateInfo.category = category;
			templateInfo.priority = templateInfo.file.name.substring(0, 2);
		}

		//parse content data
		let data = hbsParser.parsePartialData(content, { indexr: templateInfo }, config.global.debug);

		dataObject.templates.push(data);
	}

	if (config.global.debug) {
		console.log(colors.green(`dataObject: ${JSON.stringify(dataObject)}`));
	}

	let hbStream = hbsParser.createHbsGulpStream(null, dataObject, null, config.global.debug);

	return gulp.src(config.global.src + '/index.hbs')
		.pipe(hbStream)
		.pipe(rename({extname: ".html"}))
		.pipe(gulp.dest(config.global.dev));

});

gulp.task('watch:static:hb:indexr', function () {

	watch(config.global.src + '/pages/*.hbs', config.watch, function () {
		runSequence(
			['static:hb:indexr','static:hb']
		);
	});

});
