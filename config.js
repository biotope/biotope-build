const cwd = process.cwd();
const src = 'src';
const dev = '.tmp';
const dist = 'dist';
const docs = 'documentation';
const node = 'node_modules';

const lazyPlugins = require('gulp-load-plugins')({
	pattern: [
		'autoprefixer',
		'check-dependencies',
		'colors',
		'del',
		'globule',
		'gulp',
		'jshint-stylish',
		'lazypipe',
		'lodash',
		'merge-stream',
		'opn',
		'pump',
		'run-sequence',
		'vinyl-named',
		'webpack',
		'webpack-stream'
	],
	overridePattern: false
});

const os = require('os');
const isWin = /^win/.test(os.platform());


module.exports = {
	plugins: lazyPlugins,
	global: {
		src: src,
		dev: dev,
		dist: dist,
		docs: docs,
		node: node,
		cwd: cwd,
		isWin: isWin,
		debug: false,
		dataObject: 'data',
		resources: ['/resources'],
		components: ['/components'],
		handlebarsHelper: '/js/handlebars.helper.js',
		tasks: {
			browserSupport: true,
			cleanCss: true,
			cssStats: true,
			favicons: true,
			handlebars: true,
			iconfont: true,
			image: true,
			less: false,
			linting: true,
			markdown: false,
			sass: true,
			uglify: true,
			webpack: true
		},
		externalResources: {},
		bowerResources: {},
		reactEntryPoints: [],
		packageData: require(cwd + '/package.json')
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

	cleanCss: {},

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

	cssmin: {},

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
		includePaths: []
	},

	sassLint: {},

	tslint: {
		formatter: 'prose',
		configuration: {
			rules: {
				"quotemark": [true, "single"]
			}
		}
	},

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

try {
    const projectConfig = require(cwd + '/projectConfig');
    if (projectConfig) {
        lazyPlugins.lodash.merge(module.exports, projectConfig);
    }
} catch(e) {}
