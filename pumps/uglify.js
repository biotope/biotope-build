module.exports = {
  defaultPump: (config) => {
    const uglifyEs = require('uglify-es');
    const composer = require('gulp-uglify/composer');
    const sourcemaps = require('gulp-sourcemaps');
    const noop = require('gulp-noop');
    const minify = composer(uglifyEs, console);
    return [
      config.uglify.sourcemaps ? sourcemaps.init() : noop(),
      minify(config.uglify.options),
      config.uglify.sourcemaps ? sourcemaps.write('./') : noop()
    ];
  }
};
