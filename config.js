const cwd = process.cwd();
const src = 'src';
const dev = '.tmp';
const dist = 'dist';
const node = 'node_modules';

const _ = require('lodash');
const projectConfig = require(cwd + '/projectConfig');
const os = require('os');
const isWin = /^win/.test(os.platform());

module.exports = {
	global: {
		src: src,
		dev: dev,
		dist: dist,
		node: node,
		cwd: cwd,
		isWin: isWin,
		debug: false,
		dataObject: 'data',
		resources: '/resources',
		components: '/components',
		handlebarsHelper: '/js/handlebars.helper.js',
		tasks: {
			browserSupport: true,
			cleanCss: true,
			cssStats: true,
			favicons: true,
			handlebars: true,
			iconfont: true,
			image: true,
			linting: true,
			sass: true,
			uglify: true,
			webpack: true
		},
		externalResources: {},
		bowerResources: {}
	},

	//=== Plugins ===//
	autoprefixer: {
		//browsers: ['last 3 versions', 'last 8 Chrome versions', 'last 8 Firefox versions' , 'Firefox ESR', 'ie 9', 'last 2 iOS versions', 'Android 4']
		browsers: ['last 1 version']
	},

	browserSupport: {
		file: cwd + '/browserSupport.json'
	},

	checkDependencies: {},

	cleanCss: {
		rebase: false
	},

	connect: {
		port: 9000,
		globs: [
			dev + '/**/*.*',
			src + '/resources/js/**/*.js',
			src + '/resources/bower_components/**/*',
			src + '/_mock/**/*',
			src + '/_config/**/*',
			'!' + dev + '/_mock/**/*',
			'!' + dev + '/_config/**/*',
			'!' + dev + '/_assets/**/*',
			'!' + dev + '/resources/js/vendor/**/*.js',
			'!' + dev + '/resources/css/**/*.map',
			'!' + dev + '/resources/bower_components/**/*',
			'!' + dev + '/resources/js/handlebars.templates.js'
		]
	},

	cssstats: {
		exit: true
	},

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
		namespace: 'ffglobal.configuration.data.tpl',
		noRedeclare: true
	},

	iconfont: {
		fontName: 'Icons',
		prependUnicode: true,
		timestamp: Math.round(Date.now() / 1000),
		normalize: true
	},

	iconfontCss: [
		{
			fontName: 'Icons',
			path: src + '/resources/scss/fonts/iconfont/_icons.scss',
			targetPath: '../../../../.iconfont/_icons.scss',
			fontPath: '../fonts/icons/',
			cssClass: 'icon'
		}, {
			fontName: 'Icons',
			path: src + '/resources/scss/fonts/iconfont/_iconStyles.scss',
			targetPath: '../../../../.iconfont/_iconStyles.scss',
			fontPath: '../fonts/icons/',
			cssClass: 'icon'
		}
	],

	image: {
		verbose: true
	},

	lec: {
		verbose: false,
		eolc: 'LF',
		encoding: 'utf8'
	},

	livereload: {
		port: 35729
	},

	modernizr: {
		options: [
			"setClasses",
			"addTest"
		],
		excludeTests: [
			'hidden'
		]
	},

	sass: {
		includePaths: ['node_modules']
	},

	sassLint: {},

	uglify: {
		preserveComments: 'license',
		sourcemaps: false,
		folders: ['js', 'ts'],
		ignoreList: []
	},

	watch: {
		usePolling: isWin,
		interval: (isWin ? 250 : 100)
	},

	webpack: {
		ignoreList: []
	}
};

if (projectConfig) {
	_.merge(module.exports, projectConfig);
}
