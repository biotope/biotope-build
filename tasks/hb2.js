/*

 TODOs:
 - remove gulp-front-matter
 - check precompiled hbs task
 - cleanup tasks in index.js
 -

 */

const gulp = require('gulp');
const config = require('./../config');
const globule = require('globule');
const fs = require('fs-extra');
const path = require('path');

const handlebars = require('handlebars');
const bioHelpers = require('./../lib/hb2-helpers');
const templates = {};

const templateGlobPatterns = [
    path.join(config.global.cwd, config.global.src, 'pages', '**', '*.hbs')
];

const partialGlobPatterns = [
    path.join(config.global.cwd, config.global.src, '**', '*.hbs'),
    '!' + path.join(config.global.cwd, config.global.src, 'pages', '**', '*.hbs'),
    '!' + path.join(config.global.cwd, config.global.src, 'index.hbs'),
    '!' + path.join(config.global.cwd, config.global.src, 'browserSupport.hbs')
];


const transformPathToPartialName = (filePath) => {
    const parsedPath = path.parse(filePath);
    const pathWithoutExtension = path.join(parsedPath.dir, parsedPath.name);
    return path.relative(config.global.src, pathWithoutExtension);
};

const loadPartials = () => {
    const paths = globule.find(partialGlobPatterns);

    for(let filePath of paths) {
        const partial = handlebars.compile(fs.readFileSync(filePath, 'utf8'));
        handlebars.registerPartial(
            transformPathToPartialName(filePath),
            partial
        );
    }
};

const loadTemplate = (filePath) => {
    const frontMatter = require('front-matter');
    templates[filePath] = frontMatter(fs.readFileSync(filePath, 'utf8'));
};

const loadTemplates = () => {
    const paths = globule.find(templateGlobPatterns);

    for(let filePath of paths) {
        // console.log('globule template path', filePath);
        loadTemplate(filePath);
    }
};

// const loadHelpers = (helpers) => {
//     for(let helper in bioHelpers) {
//         console.log('register helper', helper);
//         handlebars.registerHelper(helper, bioHelpers[helper]);
//     }
// };

// const loadData = () => {};
// const loadIcons = () => {};

gulp.task('init:hb2', (cb) => {
    bioHelpers(handlebars);
    loadTemplates();
    loadPartials();
    cb();
});

gulp.task('static:hb2', (cb) => {
    for(let templatePath in templates) {
        const content = handlebars.compile(templates[templatePath].body)();

        const parsedPath = path.parse(templatePath);
        const targetPath = path.join(config.global.cwd, config.global.dist, `${parsedPath.name}.html`);

        // console.log(`write static:hb2 to ${targetPath}`);

        fs.ensureDirSync(path.parse(targetPath).dir);
        fs.writeFileSync(targetPath, content);

        // TODO do something with frontMatter data
        // content.attributes // data
        // console.log(`frontMatter in ${filePath}`, content);
    }

    cb();

    // var path = '/some/dir/file.hbs';
    // var newPath = replaceExt(path, '.html');


    // return gulp
    //     .src(config.global.src + '/pages/**/*.hbs')
    //     .pipe(frontMatter({
    //         property: 'data.frontMatter',
    //         remove: true
    //     }))
    //     .pipe(hbStream)
    //     .on('error', notify.onError(function (error) {
    //         return {
    //             title: 'static:hb',
    //             message: `${error.message} in "${error.fileName}"`
    //         };
    //     }))
    //     .pipe(rename({extname: ".html"}))
    //     .pipe(gulp.dest(config.global.dev));
});

gulp.task('watch:data:hb2', () => {});
gulp.task('watch:helpers:hb2', () => {});
gulp.task('watch:partials:hb2', () => {});
// gulp.task('watch:templates:hb2', () => {});





// gulp.task('static:hb', function () {
//     const iconParser = require('./../lib/icon-parser');
//     const jsonParser = require('./../lib/json-parser');
//     const hbsParser = require('./../lib/hbs-parser');
//     const frontMatter = require('gulp-front-matter');
//     const notify = require('gulp-notify');
//     const rename = require('gulp-rename');
//
//     //icon data, only used for demo...
//     const iconNames = iconParser.getAllIconFileNamesLowerCase(config.global.src + '/resources/icons/*.svg');
//     const preData = {};
//
//     preData[config.global.dataObject] = {
//         'icons': iconNames,
//         'package': require(config.global.cwd + '/package.json')
//     };
//
//     let hbsData = jsonParser.getAllJSONData(config.global.src + '/**/*.json', preData[config.global.dataObject]);
//
//     let hbStream = hbsParser.createHbsGulpStream(
//         [
//             config.global.src + '/**/*.hbs',
//             '!' + config.global.src + '/pages/**'
//         ],
//         hbsData, null, config.global.debug
//     );
//
//     /**
//      * reads from pages
//      * puts files to .tmp
//      */
//     return gulp
//         .src(config.global.src + '/pages/**/*.hbs')
//         .pipe(frontMatter({
//             property: 'data.frontMatter',
//             remove: true
//         }))
//         .pipe(hbStream)
//         .on('error', notify.onError(function (error) {
//             return {
//                 title: 'static:hb',
//                 message: `${error.message} in "${error.fileName}"`
//             };
//         }))
//         .pipe(rename({extname: ".html"}))
//         .pipe(gulp.dest(config.global.dev));
//
// });
//
//
// gulp.task('watch:static:hb', function () {
//     const runSequence = require('run-sequence');
//     const watch = require('gulp-watch');
//     const files = [
//         config.global.src + '/**/*.hbs',
//         config.global.src + '/**/*.json',
//         '!' + config.global.src + '/pages/**'
//     ];
//
//     watch(files, config.watch, function () {
//         runSequence(
//             ['static:hb'],
//             ['livereload']
//         );
//     });
//
// });
//
//
// /**
//  * indexr creates the preview file index
//  */
// gulp.task('static:hb:indexr', function () {
//     const jsonParser = require('./../lib/json-parser');
//     const hbsParser = require('./../lib/hbs-parser');
//     const fs = require('fs');
//     const globule = require('globule');
//     const path = require('path');
//     const rename = require('gulp-rename');
//     const browserSupportData = jsonParser.getBrowserSupportData();
//     const dataObject = {
//         package: require(config.global.cwd + '/package.json'),
//         templates: [],
//         browserSupport: {}
//     };
//
//     if (config.global.tasks.browserSupport && browserSupportData) {
//         dataObject.browserSupport = browserSupportData;
//     }
//
//     // read all files
//     const filepaths = globule.find([
//         config.global.src + '/pages/*.hbs'
//     ]);
//
//     let lastCategory = '';
//     for (let index in filepaths) {
//         let content = fs.readFileSync(filepaths[index], 'utf8');
//         let templateInfo = {};
//
//         templateInfo.file = path.parse(filepaths[index]);
//
//         // check current category
//         let category = templateInfo.file.name.substring(2, templateInfo.file.name.indexOf('.'));
//         if (lastCategory !== category) {
//             lastCategory = category;
//             templateInfo.category = category;
//             templateInfo.priority = templateInfo.file.name.substring(0, 2);
//         }
//
//         //parse content data
//         let data = hbsParser.parsePartialData(content, {indexr: templateInfo}, config.global.debug);
//
//         dataObject.templates.push(data);
//     }
//
//     if (config.global.debug) {
//         const colors = require('colors/safe');
//         console.log(colors.green(`dataObject: ${JSON.stringify(dataObject)}`));
//     }
//
//     let hbStream = hbsParser.createHbsGulpStream(null, dataObject, null, config.global.debug);
//
//     return gulp.src(config.global.src + '/index.hbs')
//         .pipe(hbStream)
//         .pipe(rename({extname: ".html"}))
//         .pipe(gulp.dest(config.global.dev));
//
// });
//
// gulp.task('watch:static:hb:indexr', function () {
//     const runSequence = require('run-sequence');
//     const watch = require('gulp-watch');
//
//     watch(config.global.src + '/pages/*.hbs', config.watch, function () {
//         runSequence(
//             ['static:hb:indexr', 'static:hb'],
//             ['livereload']
//         );
//     });
//
// });
