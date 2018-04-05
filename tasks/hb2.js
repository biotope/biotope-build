/*

 TODOs:
 - remove gulp-front-matter
 - check precompiled hbs task
 - cleanup tasks in index.js
 - check legacy handlebars helper file

 */

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
    path.join(config.global.cwd, config.global.src, 'pages', '**', '*.hbs')
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
        // console.log('globule template path', filePath);
        loadTemplate(filePath);
    }
};

const loadTemplate = (filePath) => {
    // console.log(`static:hb2 load template file ${filePath}`);
    const frontMatter = require('front-matter');
    templates[filePath] = frontMatter(fs.readFileSync(filePath, 'utf8'));

    // TODO add pages frontMatter to globalData -> globalData.templates.indexr
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
    console.log(`static:hb2 load HBS partial ${filePath} to ${transformCwdPathToPartialName(filePath)}`);

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

    // load JSON files
    const jsonFiles = globule.find(jsonGlobPatterns);
    for(let filePath of jsonFiles) {
        loadJsonFile(filePath);
    }
};



const loadJsonFile = (filePath) => {
    try {
        // console.log(`static:hb2 load JSON file ${filePath}`);

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



const renderTemplate = (templatePath) => {
    const templateContent = templates[templatePath];

    // Extend global data with site specific data
    nestedProp.set(globalData, [config.global.dataObject, config.frontMatter.property].join('.'), templateContent.attributes);

    // console.log(templatePath);
    // console.log(JSON.stringify(globalData, null, 2));

    try {

        const content = handlebars.compile(templateContent.body)(globalData);
        const parsedPath = path.parse(templatePath);
        const targetPath = path.join(config.global.cwd, config.global.dev, `${parsedPath.name}.html`);

        // console.log(`static:hb2 write template to ${targetPath}`);

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
        switch(vinyl.event) {
            case 'unlink':
                removeTemplate(vinyl.path);
                break;

            default:
                loadTemplate(vinyl.path);
        }

        runSequence(
            ['static:hb2'],
            ['livereload']
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
            ['static:hb2'],
            ['livereload']
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
            ['static:hb2'],
            ['livereload']
        );
    });
});

gulp.task('watch:icons:hb2', () => {
    const runSequence = require('run-sequence');
    const watch = require('gulp-watch');

    watch(iconGlobPatterns, config.watch, function (vinyl) {
        loadIconData();
        runSequence(
            ['static:hb2'],
            ['livereload']
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
    return getRelativePathToCwdSource(pathWithoutExtension).replace('\\', '/');
};

const transformCwdFilePathToObjectPropertyPath = (filePath) => {
    const partialFilePath = transformCwdPathToPartialName(filePath);
    return partialFilePath.split('/').map(folder => camelCase(folder)).join('.');
};

