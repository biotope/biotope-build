const gulp = require('gulp');
const config = require('./../config');

gulp.task("version", function () {
	if (config.global.tasks.version) {
		const package = require(config.global.cwd + '/package.json');
		const path = config.global.dist + config.global.resources + '/VERSION';
		const fs = require('fs');

		fs.writeFile(path, package.version, function(error) {
			if(error) {
				const colors = require('colors/safe');
				return console.log(colors.red(error));
			}
		});
	}
});
