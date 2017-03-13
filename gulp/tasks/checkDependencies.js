var gulp = require('gulp');
var dependencies = require('check-dependencies');
var gutil = require('gulp-util');
var config = require('./../config');


gulp.task('checkDependencies', function () {

	var output = dependencies.sync(config.checkDependencies);
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
