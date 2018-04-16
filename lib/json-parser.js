const config = require('./../config');

const getBrowserSupportData = () => {
	if(config.browserSupport.file) {
		try {
			const browserSupportData = require(config.browserSupport.file);
			return browserSupportData;
		} catch(e) {}
	}

	return null;
};

module.exports = {
	getBrowserSupportData: getBrowserSupportData
};
