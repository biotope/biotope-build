const hbsHelpers = require('./hbs-helpers');
const hb = require('gulp-hb');
const colors = require('colors/safe');
const fm = require('front-matter');
const config = require('./../config');

const createHbsGulpStream = (partials, dataObject, dataGlob, debug=false) => {

	let hbStream = hb({ debug: debug })
		.helpers(hbsHelpers);

	// set external hbs helpers
	const hbsHelpersExternal = config.global.buildFrameworkExternalHbsHelpers;
	if (hbsHelpersExternal) {
		hbStream.helpers(hbsHelpersExternal);
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

const parsePartialData = (content, data={}, debug=false) => {
	let frontMatterContent = fm(content);

	if (debug) {
		console.log(colors.green(`frontMatter: ${JSON.stringify(frontMatterContent)}`));
	}

	Object.assign(data, frontMatterContent.attributes);

	return data;
};

module.exports = {
	createHbsGulpStream: createHbsGulpStream,
	parsePartialData: parsePartialData
};
