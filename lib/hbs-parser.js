const hbsHelpers = require('./hbs-helpers');
const hb = require('gulp-hb');
const fm = require('front-matter');

const createHbsGulpStream = (partials, dataObject, dataGlob, debug=false) => {
	// @TODO add possibility to inject helpers from external file

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

const parsePartialData = (content, data={}) => {
	let frontMatterContent = fm(content);

	Object.assign(data, frontMatterContent.attributes);

	return data;
};

module.exports = {
	createHbsGulpStream: createHbsGulpStream,
	parsePartialData: parsePartialData
};
