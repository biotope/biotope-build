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

## [5.2.1] - 2018-xx-xx
### Added
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
