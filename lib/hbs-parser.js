const createHbsGulpStream = (partials, dataObject, dataGlob, debug=false) => {
	// @TODO add possibility to inject helpers from external file
	const hbsHelpers = require('./hbs-helpers');
	const hb = require('gulp-hb');

	let hbStream = hb({ debug: debug })
		.helpers(hbsHelpers);

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
