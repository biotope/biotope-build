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

const parsePartialData = (content, data={}, debug=false) => {
	const fm = require('front-matter');
	const frontMatterContent = fm(content);

	if (debug) {
		const colors = require('colors/safe');
		console.log(colors.green(`frontMatter: ${JSON.stringify(frontMatterContent)}`));
	}

	Object.assign(data, frontMatterContent.attributes);

	return data;
};

module.exports = {
	createHbsGulpStream: createHbsGulpStream,
	parsePartialData: parsePartialData
};
