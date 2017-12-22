const config = require('./../config');
const $ = config.plugins;

module.exports = $.lazypipe()
	.pipe($.cleanCss, config.cleanCss)
	.pipe($.size, {
		title: 'minified',
		showFiles: true
	});
