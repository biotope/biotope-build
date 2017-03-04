# gulp-build-framework

## Migration checklist
### gulp-frontend-boilerplate 3.x to gulp-build-framework 4.x

1. Install yarn globally https://yarnpkg.com/en/docs/install

2. Remove devDependencies from local `package.json`

3. Add devDependencies from frontend-frameworks' [package.json](https://github.com/virtualidentityag/frontend-framework/blob/master/package.json)

4. Migrate bower.json to NPM

   Use [Bower package search](https://bower.io/search/) to search for the repositories behind the bower keys listed in your local `bower.json`. Double check if npm package name equals bower package name!!!!! 

   Install repository with Yarn `yarn add [repo-found-at-bower-search]#[version-number] --save`.
   For example: `yarn install https://github.com/janrembold/jquery-debouncedwidth#1.1.3`

   In case the target repository doesn't have a (valid) package.json:
 * Add a package.json if you have access to that repository
 * Ask the developer to add one, or better send a pull request
 * See forked repositories in https://github.com/virtualidentityag, it's possible someone else already had that problem
 * Fork the repository and add a package.json yourself and install this repository

5. Update script paths in `scripts.html` and maybe other relevant script-loading files, e.g. `_mock/configuration.js` or `conditional-resource-loader` paths.

6. Add projectConfig.json: https://github.com/virtualidentityag/frontend-framework/blob/master/projectConfig.json
* Add new configuration files from https://github.com/virtualidentityag/frontend-framework: tsconfig.json, .babelrc

7. Update "externalResources" in projectConfig.json to match old bower resources. This task copies only relevant files from node_modules to local vendor folders

8. Rename folder `app/resources/templates´ to `app/resources/hbs´

9. Rename folder `app/resources/jsx´ to `app/resources/react´ (fix script paths accordingly)

10. Check global variable naming for handlebars namespace, default is `global.configuration.data.tpl`. Some older projects use customer name instead of `global`. Change namespace in project config.

11. Load `head.configuration.js` in `<head>` BEFORE setting global configurations. Always use global.configuration getters and setters!

12. Remove .babelrc