# biotope-build
A module bundler for modern frontend applications.

## Guidelines for usage
- B-E-M NOT NEEDED ANYMORE! PLZ WRITE YOUR CSS AS IF IT WERE LOCAL!!!

- third party code will be compiled and placed in "vendor/bundle.js"

- for every js/ts file you have in your source
  - you will have that same file, with the same path, in the dist folder, built with ES6
  - you can also build an additional "legacy" file

- when importing a scss/css file inside a js/ts file, you will get an object with:
  - every class you wrote in the CSS, converted to camelCase, as a KEY
  - a AUTOMATIC-BEM class as the VALUE for each KEY
  - a property called "default" which contains all the final CSS of the file you imported

- style files will be inserted into the js/ts files that import them - always
  - this means the build will not generate any "css" files

- image files, when imported, will be turned into base64 strings

- svg files, when imported, will be simple strings containing the file contents

- cli options are sacred and override everything
  - if an option is missing on the cli, the config file options are used
  - if nothing is provided, the default configs are used
  - if an option can be an object, but a boolean is given (either in the cli or config file), then it will assume the default config is to be used (true) or not (false)

- plugins are easy to do and are the way to extend the functionality
  - have a look at /plugins/logger/index.js for a basic plugin example
  - /plugins/helpers.js has may useful functions

- plugins are as "sync" as possible
  - plugins that run before the build will always end before the build start
    - even if they are promises
    - however, if they are promises, they will be run in parallel
  - plugins that run after the build will follow the same rules
    - each "set" of "after-build" plugins will run before the next set (i.e. there is less chance that the same plugin runs more than once in parallel with itself)

## CLI and ConfigFile Options

### config
where is the config file (if any)?

cli-default: no

config-default: N/A

### project
where is the root of your code?

cli-default: `src`

config-default: `src`

### output
where should the build artifacts be placed?

cli-default: `dist`

config-default: `dist`

### copy
what folders should be copied to the `output` folder? (comma separated)

cli-default: `resources`

config-default: `['resources']` (which will be transformed into: `[{ from: 'src/resources', to: 'dist/resources', ignore: [] }]`)

### exclude
which files should be ignored during logic (js/ts) compilation?

cli-default: ``

config-default: `[]`

### watch
should the files be watched and re-compiled?

cli-default: no

config-default: `false`

### production
should the files be minified?

cli-default: no

config-default: `false`

### extLogic
which files are logic files? (comma separated)

cli-default: `.js,.ts`

config-default: `['.js', '.ts']`

### extStyle
which files are style files? (comma separated)

cli-default: `.css,.scss`

config-default: `['.css', '.scss']`

### serve
should we also build for IE11 and below?

cli-default: no

config-default: `{ port: 8000, open: false, spa: false, secure: false }`

### legacy
should we also build for IE11 and below?

cli-default: no

config-default: `{ inline: true, suffix: '.legacy' }`

### components-json
what is the components.json pattern that generates a list of components?

cli-default: `components\\/.*\\/index\\.(j|t)s$`

config-default: `components\/.*\/index\.(j|t)s$`

### chunks
which third-party libs should NOT be in "bundle.js" and where should they be placed then?

cli-default: N/A

config-default: `{ 'biotope-element': ['@biotope/element'] }`

### style
how should the style be handled? Should it be extracted to a global css file? should the classes not be renamed (i.e. treated as global classes)? should css modules be ignored altogether?

cli-default: N/A

config-default: `{ extract: false, global: false, modules: true }`

### plugins
what do you want me to run BEFORE and AFTER the build?

cli-default: N/A

config-default: `[]`

### runtime
what variables should be available globally on all JS/TS/CSS/SCSS files?

cli-default: N/A

config-default: `{ ENVIRONMENT: ?? }` (?? => "development" or "production")

## Guidelines for internal development
- everything is a plugin
- plugins that are not default WILL have their own repo/package - for now they are all stored under "/plugins" for convenience only
  - if you change the plugin API or CLI options, update and test all the plugins
- plugins that are default SHOULD have their options merged seamlessly in the CLI (example: serve)
