const gulp = require('gulp');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const colors = require('colors/safe');

const config = require('./../config');
const hbsParser = require('./../lib/hbs-parser');
const jsonParser = require('../lib/json-parser');

const packageData = require(config.global.cwd + '/package.json');
const browserSupportData = jsonParser.getBrowserSupportData();

gulp.task('browserSupport', function () {
	if (config.global.tasks.browserSupport && browserSupportData) {
		let dataObject = {
			package: packageData,
			browserSupport: browserSupportData
		};

		if (config.global.debug) {
			console.log(colors.green(`dataObject: ${JSON.stringify(dataObject)}`));
		}

		let hbStream = hbsParser.createHbsGulpStream(null, dataObject, null, config.global.debug);

		return gulp.src(config.global.src + '/browserSupport.hbs')
			.pipe(hbStream)
			.pipe(rename({extname: ".html"}))
			.pipe(gulp.dest(config.global.dev));
	} else {
		console.log(colors.yellow('browserSupport disabled'));
	}
});

gulp.task('watch:browserSupport', function () {
	if (config.global.tasks.browserSupport && browserSupportData) {
		watch(config.global.cwd + './browserSupport.json', config.watch, function () {
			runSequence(
				['browserSupport']
			);
		});
	}
});
