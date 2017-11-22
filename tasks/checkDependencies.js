const gulp = require('gulp');
const dependencies = require('check-dependencies');
const gutil = require('gulp-util');
const config = require('./../config');


gulp.task('checkDependencies', function () {

	const output = dependencies.sync(config.checkDependencies);
	if (output.status === 1) {

		if (output.error.length > 0) {
			for (var i = 0; i < output.error.length; i++) {
				gutil.log(gutil.colors.red(output.error[i]));
			}
		}

		return process.exit(2);
	}

	gutil.log(gutil.colors.green('All installed package versions are in sync with package.json'));
	return true;

});
