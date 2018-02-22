const gulp = require('gulp');
const config = require('./../config');
const jsonParser = require('../lib/json-parser');
const browserSupportData = jsonParser.getBrowserSupportData();

gulp.task('browserSupport', function () {
	const colors = require('colors/safe');

	if (config.global.tasks.browserSupport && browserSupportData) {
		const rename = require('gulp-rename');

		const dataObject = {
			package: require(config.global.cwd + '/package.json'),
			browserSupport: browserSupportData
		};

		if (config.global.debug) {
			console.log(colors.green(`dataObject: ${JSON.stringify(dataObject)}`));
		}

		const hbsParser = require('./../lib/hbs-parser');
		const hbStream = hbsParser.createHbsGulpStream(null, dataObject, null, config.global.debug);

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
		const watch = require('gulp-watch');
		const runSequence = require('run-sequence');

		watch(config.global.cwd + './browserSupport.json', config.watch, function () {
			runSequence(
				['browserSupport']
			);
		});
	}
});
