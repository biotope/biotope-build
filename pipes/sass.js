const config = require('./../config');
const $ = config.plugins;

module.exports = $.lazypipe()
	.pipe($.sourcemaps.init)
	.pipe(() => {
		return $.sass(config.sass).on('error', $.sass.logError)
	})
	.pipe($.postcss, [ $.autoprefixer(config.autoprefixer) ])
	.pipe($.sourcemaps.write, '.');
