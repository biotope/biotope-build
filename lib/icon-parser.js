const path = require('path');
const config = require('./../config');
const $ = config.plugins;

const getAllIconFileNamesLowerCase = (glob) => {
	let icons = $.globule.find(glob);
	let iconData = [];

	for (let index in icons) {
		let file = path.parse(icons[index]);
		iconData.push(file.name.toLowerCase());
	}

	return iconData;
};

module.exports = {
	getAllIconFileNamesLowerCase: getAllIconFileNamesLowerCase
};
