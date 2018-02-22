const cwd = process.cwd();
const config = require('./../config');
const hbsHelpers = require('./hbs-helpers');
const projectHbsHelpersPath = '/' + config.global.src + config.global.resources + config.global.handlebarsHelper;
const projectHbsHelpers = require(cwd + projectHbsHelpersPath);
const hb = require('gulp-hb');
const colors = require('colors/safe');
const fm = require('front-matter');

const createHbsGulpStream = (partials, dataObject, dataGlob, debug=false) => {

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
