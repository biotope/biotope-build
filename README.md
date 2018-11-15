# biotope-build
Build Package for biotope-boilerplate.

## Features
- Typescript + Babel
- ES6 unglify
- SCSS
- Autoprefixer
- Icon Font
- SVG Sprite generation
- HBS for templating
- ESLint
- Dev Servers

## Options & Settings

All biotope-build options can be set in local /projectConfig.js (<5.x /projectConfig.json)

See default config: <https://github.com/biotope/biotope-build/blob/master/config.js>

### framework internals
#### global settings
```
{
   <String> src: src, //base folder for all the project files, defaults to 'src'
   <String> dev: dev, //temporary folder for all files that get created in the serve/build process, defaults to '.tmp'
   <String> dist: dist, //build folder for the finalized files when running a build process, defaults to 'dist'
   <String> node: node, //node_modules base folder, defaults to 'node_modules'
   <String> cwd: cwd, //process.cwd(), current working dir of node project ###TODO should maybe be private###
   <boolean> isWin: isWin, //checks the os and sets the variable to true if running on a windows system
   <boolean> debug: false, //toggle debbuging prompts from the tasks (static:hb, browserConfig, partialHelper), default is false
   <String> dataObject: 'data' //name of the global data object, which can be used in static handlebars templates via {{data.key}}
   Array<String> resources: ['/resources'], //resource folders inside the src folder, needed to run multiple tasks, can contain multiple different folders
   Array<String> components: ['/components'] //component folders corresponding to the resource folders
   <String> handlebarsHelper: '/js/handlebars.helper.js', //path to dynamic handlebar helpers relative to the resources folder
   <Object> tasks: {}, //see tasks
   <Object> externalResources: {} //see external resources
   <Object> bowerResources: {} //see bower resources
}
```
#### tasks settings
You can toggle certain task in biotope-build. Every Task can be configurated with a boolean.

This list shows the configurable tasks as well as a brief description about what they do.
```
{
	browserSupport: true, //creates an overview of the support browser from a *.json file
	cleanCss: true, //minify CSS files for build
	cssStats: true, //checks the maximum selectors in each css file, fails if there are more than 4096 (IE 9 issue)
	favicons: true, //creates and embeds the favicons as well as the mobile icons from an image, default image root is '/resources/'
	handlebars: true, //creates dynamic handlebar templates from hbs files, static page generation is handled in a seperate task
	iconfont: true, //creates the iconfont from svg images, default icon path is '/resources/icons'
	image: true, //compress images stores in '/resources/img'
	linting: true, //linting of js/ts/scss files
	sass: true, //disables the sass compiler, disabled if you use vanilla css
	uglify: true, //uglifies js files in the build
	webpack: true //compiles typescript and transpiles ES6 Code in *.ts files
}
```
#### externalResources
If you use external resources for the final build you can add those with this object. The module name references the module inside the node_modules folder. The file name needs to be relative to the module.

JS files then get copied to '.tmp/resources/js/vendor/', CSS files to '.tmp/resources/css/vendor/'. When using scss files, reference the node_modules folder directly from there.
```
{
	'moduleName': 'singleFile.ext',
	'otherModuleName': ['firstFile.ext', 'folder/secondFile.ext2'],
}
```

### plugin defaults
#### autoprefixer
Autoprefixer uses the default options, with the last browser versions.
Repo: https://github.com/postcss/autoprefixer#options

```
autoprefixer: {
	browsers: ['last 1 version']
},
```

#### browserSupport
Set the file path to the corresponding *.json file to create a browser support overview.

```
browserSupport: {
	file: cwd + '/browserSupport.json'
},
```

#### checkDependencies
Check dependencies only uses default options.
Repo: https://github.com/mgol/check-dependencies

#### cleanCss
Clean CSS uses default options with rebase set to false to prevent rewriting file paths.
Repo: https://www.npmjs.com/package/gulp-clean-css
Repo: https://github.com/jakubpawlowicz/clean-css
```
cleanCss: {
	rebase: false
},
```

#### cssStats
cssStats exits on error in order to break the build process.
Repo: https://github.com/cssstats/gulp-cssstats

```
cssstats: {
	exit: true
},
```

#### connect
Set the port and the folders being watch for connect/livereload.
Repo: https://github.com/avevlad/gulp-connect

```
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
```

#### favicons
This creates all the favicons and a manifest.json from an image file.
Repo: https://github.com/evilebottnawi/favicons

```
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
```

#### handlebars
Dynamic handlebar templates and partials get created and added to a namespace.
Repo: https://github.com/lazd/gulp-handlebars

```
handlebars: {
	templateWrap: 'Handlebars.template(<%= contents %>)',
	partialWrap: 'Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));',
	namespace: 'ffglobal.configuration.data.tpl',
	noRedeclare: true
},
```

#### iconfont
Icon font settings are split into gulp-svgicons2svgfont settings and the path settings.
Repo: https://github.com/nfroidure/gulp-svgicons2svgfont

```
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
```

#### image
Minifiy the images inside "/resources/img".
Repo: https://github.com/sindresorhus/gulp-imagemin

```
image: {
	verbose: true
},
```

#### lec
Force line-endings to 'LF' formatting to create unification across platform.
Repo: https://github.com/iShafayet/gulp-line-ending-corrector

```
lec: {
	verbose: false,
	eolc: 'LF',
	encoding: 'utf8'
},
```

#### livereload
Specifies the port for using livereload. Runs with connect. See connect settings.
```
livereload: {
	port: 35729
},
```

#### modernizr
Runs modernizr tests and creates polyfills.
Repo: https://github.com/doctyper/gulp-modernizr
Options: https://github.com/Modernizr/customizr#config-file
```
modernizr: {
	options: [
		"setClasses",
		"addTest"
	],
	excludeTests: [
		'hidden'
	]
},
```

#### sass
Sass compiler based on node-sass.
Repo: https://github.com/dlmanning/gulp-sass
Options: https://github.com/sass/node-sass#options
```
sass: {
	includePaths: []
},
```

#### sassLint
Linting of sass files. Default options. Rules need to be defined.
Repo: https://github.com/sasstools/gulp-sass-lint
```
sassLint: {},
```

#### ugflify
Javascript uglification settings.
Repo: https://github.com/terinjokes/gulp-uglify

```
uglify: {
	preserveComments: 'license',
	sourcemaps: false,
	folders: ['js', 'ts'],
	ignoreList: []
},
```

#### watch
Watch task uses polling on windows system, therefore the interval is increased to reduce cpu usage.
Repo: https://github.com/floatdrop/gulp-watch

```
watch: {
	usePolling: isWin,
	interval: (isWin ? 250 : 100)
},
```

#### webpack
Add files to an ignoreList, set path relative to src path. Webpack settings are set via webpack.config.js
Repo: https://github.com/webpack/webpack
```
webpack: {
	ignoreList: []
}
```

### others
There are other tasks in use, but they can not be modified via a projectConfig.js file. If this is needed please open an issue or send a pull request.

### Troubleshooting, Bugs & Issues
#### Knows issues
- Missing documentation (on the roadmap)
- Poor performance (on the roadmap)

If you encounter errors, please submit an issue.
