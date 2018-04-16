/* Deprecated: Remove this function */
const createHbsGulpStream = (partials, dataObject, dataGlob, debug=false) => {
	const hb = require('gulp-hb');
	const hbsHelpers = require('./hbs-helpers');
	const cwd = process.cwd();
	const config = require('./../config');
	const path = require('path');
	const projectHbsHelpersPath = path.join(cwd, '/', config.global.src, config.global.resources, config.global.handlebarsHelper);
	const projectHbsHelpers = require(projectHbsHelpersPath);

	let hbStream = hb({ debug: debug })
		.helpers(hbsHelpers);

	if (projectHbsHelpers) {
		hbStream.helpers(projectHbsHelpers);
	}

	if(partials) {
		hbStream.partials(partials);
	}

	if(dataObject) {
		hbStream.data(dataObject);
	}

	if(dataGlob) {
		hbStream.data(dataGlob);
	}

	return hbStream;
};

module.exports = {
	createHbsGulpStream: createHbsGulpStream
};
