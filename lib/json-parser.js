const config = require('./../config');

const getAllJSONData = (glob, externalData) => {
	const fs = require('fs');
	const path = require('path');
	const globule = require('globule');
	const filepaths = globule.find(glob);
	const dataObject = {};
	dataObject[config.global.dataObject] = externalData;

	for (let index in filepaths) {
		// read contents
		const content = JSON.parse(fs.readFileSync(filepaths[index], 'utf8'));

		// normalize path and file name
		const file = path.parse(filepaths[index]);
		const dirs = file.dir.split('/');
		dirs.push(file.name);
		dirs.forEach(function(currentDir, index) {
			if (currentDir !== config.global.src) {
				let objectName = camelCase(currentDir);

				dirs[index] = objectName;
			} else {
				dirs.splice(index, 1);
			}
		});

		// modfiy object
		modifyObject(dataObject[config.global.dataObject], dirs, content);
	}

	return dataObject;
};

// modfiy object to add new keys and apply the value to the last key
const modifyObject = (obj, keys, val) => {
	const lastKey = keys.pop();
	const lastObj = keys.reduce((obj, key) =>
			obj[key] = obj[key] || {},
		obj);
	lastObj[lastKey] = val;
};

// create CamelCase from dot notation
const camelCase = (input) => {
	return input.replace(/\.(.)/g, function(match, group1) {
		return group1.toUpperCase();
	});
};

const getBrowserSupportData = () => {
	const browserSupportJson = config.browserSupport.file;
	let browserSupportData;

	try {
		browserSupportData = require(browserSupportJson);
	} catch(e) {
		browserSupportData = null;
	}

	return browserSupportData;
};

module.exports = {
	getAllJSONData: getAllJSONData,
	getBrowserSupportData: getBrowserSupportData
};
