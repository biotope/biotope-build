const globule = require('globule');
const path = require('path');

const getAllIconFileNamesLowerCase = (glob) => {
	let icons = globule.find(glob);
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
