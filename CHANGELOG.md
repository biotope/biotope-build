# Changelog

<details>
  <summary>
	Placeholder section to be used for future releases. Make no changes here.
  </summary>

## [Unreleased] - YYYY-MM-DD
### Added
- for new features.
### Changed
- for changes in existing functionality.
### Deprecated
- for soon-to-be removed features.
### Removed
- for now removed features.
### Fixed
- for any bug fixes.

</details>

## [5.3.6] - 2018-06-05 
### Fixed
- Webpack tasks is broken when no TS files are available

## [5.3.5] - 2018-05-30 
### Fixed
- Heap out of memory bug (https://github.com/biotope/biotope-build/issues/48)
### Changed
- Local tsconfig.json needs update:
```
	"awesomeTypescriptLoaderOptions": {
		"useCache": true,
		"reportFiles": [
			"src/**/*.{ts,tsx}"
		]
	},
```

## [5.3.4] - 2018-05-20 
### Removed
- Iconfont path checker

## [5.3.3] - 2018-05-20
### Changed
- Webpack4 Update - also added entry points support instead of piping vinyl files to webpack
### Fixed
- Useref task now handles html and hbs extension
- Useref task now uses bioHelpers   
### Added
- Iconfont path checker

## [5.3.2] - 2018-04-24
### Fixed
- Webpack now loads JS and JSX files with babel loader 

## [5.3.1] - 2018-04-18
### Fixed
- Missing semicolon in biotope handlebars helper injection

## [5.3.0] - 2018-04-17
### Changed
- Complete Handlebars Task Refactoring 
- BREAKING: Change `handlebars.helpers.js` according to `https://github.com/biotope/biotope/blob/5.3.0/src/resources/js/handlebars.helper.js`
- BREAKING: Change `index.hbs` according to `https://github.com/biotope/biotope/blob/5.3.0/src/index.hbs`
- BREAKING: Change `browserSupport.hbs` according to `https://github.com/biotope/biotope/blob/5.3.0/src/browserSupport.hbs`
- BREAKING: Rename all {{ frontMatter.* }} expressions to {{ data.frontMatter.* }} - mostly used in layout template as title tag

## [5.2.1] - 2018-03-14
### Added
- Copies "_mock" folders inside components to dist during build
- Writes version specified in package.json to resources/VERSION

## [5.2.0] - 2018-02-25
### Changed
 - BREAKING: Repository name changed to github.com/biotope/biotope-build. Adjust your package.json 
 - BREAKING: Prefixed all handlebars helper functions with "bio", for example the helper "include" is now named "bioInclude". This reduces chance of naming collision with variables [(see)](https://github.com/biotope/biotope-build/pull/45/files)
 - BREAKING: "resources" and "components" in projectConfig.json have now to be strings instead of arrays [(see)](https://github.com/biotope/biotope-build/pull/40/commits/3cde1073237241db1fc0749ca24b3a9ec41e4521)
### Added
- support for customizable hbs helper file added (add handlebarsHelper: "pathToHelperFile" to your project config). with that it is now possible to use same helper file for static and dynamic hbs rendering. [(see issue)](https://github.com/biotope/biotope-build/issues/4)
- handlebars bioImg helper added. [(#36)](https://github.com/biotope/biotope-build/issues/36)
- handlebars for-loop helper added.
### Deprecated
- iconfont eot file generation is deprecated with this release and will be removed in 5.3.0 (all supported browsers can handle woff or ttf)
### Fixed
- livereload triggered multiple times fixes
- gulp startup performance improvements
