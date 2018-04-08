module.exports = {
    defaultPump: (config) => {
        const uglify = require('gulp-uglify');
        const sourcemaps = require('gulp-sourcemaps');
        const noop = require('gulp-noop');

        return [
            config.uglify.sourcemaps ? sourcemaps.init() : noop(),
            uglify(config.uglify.options),
            config.uglify.sourcemaps ? sourcemaps.write('./') : noop()
        ];
    }
};