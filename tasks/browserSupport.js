const path = require('path');
const config = require('./../config');
const $ = config.plugins;

const jsonParser = require('../lib/json-parser');
const browserSupportData = jsonParser.getBrowserSupportData();

$.gulp.task('browserSupport', function () {
	if (config.global.tasks.browserSupport && browserSupportData) {
		const hbsParser = require('./../lib/hbs-parser');
		const dataObject = {
			package: config.global.packageData,
			browserSupport: browserSupportData
		};

		if (config.global.debug) {
			console.log($.colors.green(`dataObject: ${JSON.stringify(dataObject)}`));
		}

		const hbStream = hbsParser.createHbsGulpStream(null, dataObject, null, config.global.debug);
		const sourcePaths = path.join(config.global.src, 'browserSupport.hbs');

		return $.gulp.src(sourcePaths)
			.pipe(hbStream)
			.pipe($.rename({extname: ".html"}))
			.pipe($.gulp.dest(config.global.dev));
	} else {
		console.log($.colors.yellow('browserSupport disabled'));
	}
});

$.gulp.task('watch:browserSupport', function () {
	if (config.global.tasks.browserSupport && browserSupportData) {

		const sourcePaths = path.join(config.global.src, 'browserSupport.json');
		$.watch(sourcePaths, config.watch, function () {
			$.runSequence(
				['browserSupport']
			);
		});
	}
});
