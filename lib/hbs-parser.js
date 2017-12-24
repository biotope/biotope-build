const config = require('./../config');
const $ = config.plugins;

// @TODO add possibility to inject helpers from external file
const createHbsGulpStream = (partials, dataObject, dataGlob, debug=false) => {
    const hbsHelpers = require('./hbs-helpers');

	let hbStream = $.hb({ debug: debug })
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
	let frontMatterContent = $.frontMatter(content);

	if (debug) {
		console.log($.colors.green(`frontMatter: ${JSON.stringify(frontMatterContent)}`));
	}

	Object.assign(data, frontMatterContent.attributes);

	return data;
};

module.exports = {
	createHbsGulpStream: createHbsGulpStream,
	parsePartialData: parsePartialData
};
