const path = require('path');
const config = require('./../config');
const $ = config.plugins;

const getAllIconFileNamesLowerCase = (glob) => {
	const icons = $.globule.find(glob);
	const iconData = [];

	for (let index in icons) {
		const file = path.parse(icons[index]);
		iconData.push(file.name.toLowerCase());
	}

	return iconData;
};

module.exports = {
	getAllIconFileNamesLowerCase: getAllIconFileNamesLowerCase
};
