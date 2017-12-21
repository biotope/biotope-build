const config = require('./../config');
const $ = config.plugins;

$.gulp.task('checkDependencies', function () {
	const output = $.checkDependencies.sync(config.checkDependencies);
	if (output.status === 1) {

		if (output.error.length > 0) {
			for (let i = 0; i < output.error.length; i++) {
				console.log($.colors.red(output.error[i]));
			}
		}

		return process.exit(2);
	}

	console.log($.colors.green('All installed package versions are in sync with package.json'));
	return true;
});
