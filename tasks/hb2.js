const gulp = require('gulp');
const config = require('./../config');
const globule = require('globule');
const fs = require('fs-extra');
const path = require('path');
const nestedProp = require('nested-property');
const camelCase = require('camelcase');

const handlebars = require('handlebars');
const templates = {};
const globalData = {};

const templateGlobPatterns = [
	path.join(config.global.cwd, config.global.src, 'pages', '**', '*.hbs'),
	path.join(config.global.cwd, config.global.src, 'index.hbs'),
	path.join(config.global.cwd, config.global.src, 'browserSupport.hbs')
];

const partialGlobPatterns = [
	path.join(config.global.cwd, config.global.src, '**', '*.hbs'),
	'!' + path.join(config.global.cwd, config.global.src, 'pages', '**', '*.hbs'),
	'!' + path.join(config.global.cwd, config.global.src, 'index.hbs'),
	'!' + path.join(config.global.cwd, config.global.src, 'browserSupport.hbs')
];

const jsonGlobPatterns = [
	path.join(config.global.cwd, config.global.src, '**', '*.json')
];

const iconGlobPatterns = [
	path.join(config.global.cwd, config.global.src, 'resources', 'icons', '*.svg')
];

const loadTemplates = () => {
	const paths = globule.find(templateGlobPatterns);

	for(let filePath of paths) {
		loadTemplate(filePath);
	}
};

const loadTemplate = (filePath) => {
	const frontMatter = require('front-matter');
	templates[filePath] = frontMatter(fs.readFileSync(filePath, 'utf8'));
	templates[filePath].precompiled = handlebars.compile(templates[filePath].body);
};

const removeTemplate = (filePath) => {
	if(templates.hasOwnProperty(filePath)) {
		delete templates[filePath];
	}
};

const loadPartials = () => {
	const paths = globule.find(partialGlobPatterns);

	for(let filePath of paths) {
		loadPartial(filePath);
	}
};

const loadPartial = (filePath) => {
	handlebars.registerPartial(
		transformCwdPathToPartialName(filePath),
		handlebars.compile(fs.readFileSync(filePath, 'utf8'))
	);
};

const removePartial = (filePath) => {
	handlebars.unregisterPartial(transformCwdPathToPartialName(filePath));
};

const loadHelpers = () => {
	const bioHelpers = require('./../lib/hb2-helpers');
	bioHelpers(handlebars);

	if(config.global.handlebarsHelper) {
		const projectHbsHelpersPath = path.join(config.global.cwd, config.global.src, config.global.resources, config.global.handlebarsHelper);

		try {
			const projectHelpers = require(projectHbsHelpersPath);
			projectHelpers(handlebars);
		} catch(e) {
			const colors = require('colors/safe');
			console.log(colors.yellow(`static:hb: Trying to load "${projectHbsHelpersPath}" into helpers.\n${e.message}\nSee global.handlebarsHelper property in https://github.com/biotope/biotope-build/blob/master/config.js`));
		}
	}
};

const loadJsonData = () => {
	// load package.json
	const packagePath = path.join(config.global.cwd, 'package.json');
	const packageData = require(packagePath);
	nestedProp.set(globalData, [config.global.dataObject, 'package'].join('.'), packageData);

	// load browser support data
	const jsonParser = require('../lib/json-parser');
	const browserSupportData = jsonParser.getBrowserSupportData();
	nestedProp.set(globalData, config.browserSupport.property, browserSupportData);

	// load JSON files
	const jsonFiles = globule.find(jsonGlobPatterns);
	for(let filePath of jsonFiles) {
		loadJsonFile(filePath);
	}
};

const loadJsonFile = (filePath) => {
	try {
		const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		const objectPropertyPath = transformCwdFilePathToObjectPropertyPath(filePath);
		nestedProp.set(globalData, [config.global.dataObject, objectPropertyPath].join('.'), jsonContent);
	} catch(e) {
		const colors = require('colors/safe');
		console.log(colors.red(`hbs:error loading JSON file "${filePath}": "${e.message}"`));
	}
};

const loadIconData = () => {
	const iconFiles = globule.find(iconGlobPatterns);
	const iconData = [];

	for(let iconPath of iconFiles) {
		let parsedIconPath = path.parse(iconPath);
		iconData.push(parsedIconPath.name.toLowerCase());
	}

	nestedProp.set(globalData, [config.global.dataObject, 'icons'].join('.'), iconData);
};

const loadIndexrData = () => {
	nestedProp.set(globalData, [config.global.dataObject, 'indexr'].join('.'), prepareTemplateDataForIndexr());
};

const renderTemplate = (templatePath) => {
	const templateContent = templates[templatePath];

	// Extend global data with site specific data
	nestedProp.set(globalData, [config.global.dataObject, config.frontMatter.property].join('.'), templateContent.attributes);

	try {
		const content = templateContent.precompiled(globalData);
		const parsedPath = path.parse(templatePath);
		const targetPath = path.join(config.global.cwd, config.global.dev, `${parsedPath.name}.html`);

		fs.ensureDirSync(path.parse(targetPath).dir);
		fs.writeFileSync(targetPath, content);
	} catch(e) {
		const colors = require('colors/safe');
		console.log(colors.red(`hbs:error "${templatePath}": "${e.message}"`));
	}
};

gulp.task('init:hb2', (cb) => {
	loadHelpers();
	loadTemplates();
	loadPartials();
	loadJsonData();
	loadIconData();
	loadIndexrData();
	cb();
});

gulp.task('static:hb2', (cb) => {
	for(let templatePath in templates) {
		renderTemplate(templatePath);
	}

	cb();
});

gulp.task('watch:templates:hb2', () => {
	const runSequence = require('run-sequence');
	const watch = require('gulp-watch');

	watch(templateGlobPatterns, config.watch, function (vinyl) {
		let path = vinyl.path;

		if (config.global.isWin) {
			path = normalizeWinPath(path);
		}

		switch(vinyl.event) {
			case 'unlink':
				removeTemplate(path);
				break;

			default:
				loadTemplate(path);
		}

		loadIndexrData();
		runSequence(
			'static:hb2',
			'livereload'
		);
	});
});

gulp.task('watch:partials:hb2', () => {
	const runSequence = require('run-sequence');
	const watch = require('gulp-watch');

	watch(partialGlobPatterns, config.watch, function (vinyl) {
		switch(vinyl.event) {
			case 'unlink':
				removePartial(vinyl.path);
				break;

			default:
				loadPartial(vinyl.path);
		}

		runSequence(
			'static:hb2',
			'livereload'
		);
	});
});

gulp.task('watch:jsons:hb2', () => {
	const runSequence = require('run-sequence');
	const watch = require('gulp-watch');

	watch(jsonGlobPatterns, config.watch, function (vinyl) {
		switch(vinyl.event) {
			case 'unlink':
				const colors = require('colors/safe');
				console.log(colors.yellow(`Runtime removal of JSON files is not yet implemented. Go for it... (${vinyl.path} was removed)`));
				break;

			default:
				loadJsonFile(vinyl.path);
		}

		runSequence(
			'static:hb2',
			'livereload'
		);
	});
});

gulp.task('watch:icons:hb2', () => {
	const runSequence = require('run-sequence');
	const watch = require('gulp-watch');

	watch(iconGlobPatterns, config.watch, function () {
		loadIconData();
		runSequence(
			'static:hb2',
			'livereload'
		);
	});
});

const getRelativePathToCwdSource = (filePath) => {
	const cwdSourcePath = path.join(config.global.cwd, config.global.src);
	return path.relative(cwdSourcePath, filePath);
};

const removeExtensionFromPath = (filePath) => {
	const parsedPath = path.parse(filePath);
	return path.join(parsedPath.dir, parsedPath.name);
};

const transformCwdPathToPartialName = (filePath) => {
	const pathWithoutExtension = removeExtensionFromPath(filePath);
	return getRelativePathToCwdSource(pathWithoutExtension).replace(/\\/g, '/');
};

const transformCwdFilePathToObjectPropertyPath = (filePath) => {
	const partialFilePath = transformCwdPathToPartialName(filePath);
	return partialFilePath.replace(/\\/g, '/').split('/').map(folder => camelCase(folder)).join('.');
};

const normalizeWinPath = (filePath) => {
	return filePath.replace(/\\/g, '/');
};

const prepareTemplateDataForIndexr = () => {
	const sortedTemplates = [];
	const blacklistedTemplates = [
		normalizeWinPath(path.join(config.global.cwd, config.global.src, 'index.hbs')),
		normalizeWinPath(path.join(config.global.cwd, config.global.src, 'browserSupport.hbs'))
	];

	for (let template in templates) {
		if(blacklistedTemplates.indexOf(template) !== -1) {
			continue;
		}

		templates[template].filePath = template;
		templates[template].parsedFile = path.parse(template);
		templates[template].currentCategory = templates[template].parsedFile.name.substring(2, templates[template].parsedFile.name.indexOf('.'));
		templates[template].priority = templates[template].parsedFile.name.substring(0, 2);

		sortedTemplates.push(templates[template]);
	}

	sortedTemplates.sort((a, b) => {
		if (a.parsedFile.name < b.parsedFile.name) {
			return -1;
		}
		if ( a.parsedFile.name > b.parsedFile.name) {
			return 1;
		}
		return 0
	});

	let lastCategory;

	sortedTemplates.forEach((template) => {
		template.newSection = false;

		if (lastCategory !== template.currentCategory) {
			lastCategory = template.currentCategory;
			template.newSection = true;
		}
	});

	return sortedTemplates;
};
