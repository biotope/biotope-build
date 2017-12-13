const gulp = require('gulp');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');

const config = require('./../config');
const hbsParser = require('./../lib/hbs-parser');

const packageData = require(config.global.cwd + '/package.json');
const browserSupportData = require(config.global.cwd + '/browserSupport.json') || {};
/**
 * indexr creates the preview file index
 */
gulp.task('browserSupport', function () {
	if (config.global.tasks.browserSupport) {
		console.log(config.global.tasks.browserSupport);
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
	}
});

gulp.task('watch:browserSupport', function () {
	if (config.global.tasks.browserSupport) {
		watch(config.global.cwd + './browserSupport.json', config.watch, function () {
			runSequence(
				['browserSupport']
			);
		});
	}
});
