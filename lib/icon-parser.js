const getAllIconFileNamesLowerCase = (glob) => {
	const globule = require('globule');
	const path = require('path');
	const icons = globule.find(glob);
	const iconData = [];

	for (let index in icons) {
		let file = path.parse(icons[index]);
		iconData.push(file.name.toLowerCase());
	}

	return iconData;
};

module.exports = {
	getAllIconFileNamesLowerCase: getAllIconFileNamesLowerCase
};
