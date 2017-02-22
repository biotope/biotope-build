# gulp-build-framework

## Migration
### gulp-frontend-boilerplate to gulp-build-framework

1. Install yarn globally https://yarnpkg.com/en/docs/install
2. Remove devDependencies from local `package.json`
3. Add devDependencies from frontend-frameworks' [package.json](https://github.com/virtualidentityag/frontend-framework/blob/master/package.json)
4. Migrate bower.json to NPM

   Use [Bower package search](https://bower.io/search/) to search for the repositories behind the bower keys listed in your local `bower.json`. Double check if npm package name equals bower package name!!!!!

   Install repository with Yarn `yarn add [repo-found-at-bower-search]#[version-number]`.
   For example: `yarn install https://github.com/janrembold/jquery-debouncedwidth#1.1.3`

   In case the repository doesn't have a (valid) package.json:
* Add a package.json if you have access to that repository
* Ask the developer to add one, or better send a pull request
* Fork the repository and add a package.json yourself and install this repository

   Update paths in `scripts.html` and maybe other relevant script-loading files.

5. Add projectConfig.json: https://github.com/virtualidentityag/frontend-framework/blob/master/projectConfig.json
* Add new configuration files from https://github.com/virtualidentityag/frontend-framework: tsconfig.json, webpack.config.js, .babelrc
* Set "externalResources" in projectConfig.json to copy relevant files from node_modules to local vendor folders (not necessary if packages "main" property is set correctly)

6. Rename folder `app/resources/templates´ to `app/resources/hbs´
7. Check global variable naming for handlebars namespace, default is `global.configuration.data.tpl`. Some older projects use customer name instead of `global`. Change namespace in project config.