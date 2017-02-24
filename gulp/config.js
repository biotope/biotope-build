var fs = require('fs');
var _ = require('lodash');
var projectConfig = require('../../../projectConfig.json');

var src  = 'app';
var dev  = '.tmp';
var dist = 'dist';
var node = 'node_modules';

module.exports = {
    global: {
        src:  src,
        dev:  dev,
        dist: dist,
        node: node,
        resources: ['/resources'],
        tasks: {
            linting: true,
            iconfont: true,
            angular: true,
            handlebars: true,
            uglify: true,
            cleanCss: true,
            favicons: true,
            cssStats: true,
            typescript: true,
            image: true,
            webpack: true
        },
        externalResources: {}
    },

    //=== Plugins ===//
    autoprefixer: {
        //browsers: ['last 3 versions', 'last 8 Chrome versions', 'last 8 Firefox versions' , 'Firefox ESR', 'ie 9', 'last 2 iOS versions', 'Android 4']
        browsers: ['last 1 version']
    },

    cleanCss: {},

    connect: {
        port: 9000
    },

    cssmin: {},

    favicons: {
        appName: "gulp-frontend-boilerplate",
        background: "#020307",
        path: "favicons/",
        display: "standalone",
        orientation: "portrait",
        version: 1.0,
        logging: false,
        online: false,
        html: "htmlhead.favicons.html",
        pipeHTML: true,
        replace: true,
        icons: {
            appleStartup: false
        }
    },

    handlebars: {
        templateWrap: 'Handlebars.template(<%= contents %>)',
        partialWrap: 'Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));',
        namespace: 'global.configuration.data.tpl',
        noRedeclare: true
    },

    iconfont: {
        fontName: 'Icons',
        prependUnicode: true,
        timestamp: Math.round(Date.now()/1000),
        normalize: true
    },

    iconfontCss: {
        fontName: 'Icons',
        path: src + '/resources/css/fonts/iconfont/_icons.scss',
        targetPath: '../../../../.iconfont/_icons.scss',
        fontPath: '../fonts/icons/',
        cssClass: 'icon'
    },

    image: {
        verbose: true
    },

    modernizr: {
        options : [
            "setClasses",
            "addTest"
        ],
        excludeTests: ['hidden']
    },

    sass: {
        includePaths: [
            'app/resources/bower_components/foundation-sites/scss/'
        ]
    },

    tslint: {
        formatter: 'prose',
        configuration: {
            rules: {
                "quotemark": [true, "single"]
            }
        }
    },

    typescript: {},

    uglify: {
        preserveComments: 'license',
        sourcemaps: false,
        folders: ['js', 'ts', 'jsx'],
        ignoreList: []
    },

    zetzer: {
        partials: src + '/_partials',
        templates: src + '/_partials/layout',
        dot_template_settings: {
            strip: false,
            varname: 'ftf'
        },
        env: require('./tasks/zetzerHelper')
    }

};

if(projectConfig) {
    _.merge(module.exports, projectConfig);
}
