const config = require('./../config');
const $ = config.plugins;
const sourcemaps = $.sourcemaps;

module.exports = $.lazypipe()
	.pipe(sourcemaps.init)
	.pipe($.sass, config.sass)
	.pipe($.postcss, [ $.autoprefixer(config.autoprefixer) ])
	.pipe(sourcemaps.write, '.');
