var gulp = require('gulp');
var markdown = require('gulp-markdown');
var gutil = require('gulp-util');
var config = require('./../config');

gulp.task('markdown', function () {

	if (config.global.tasks.markdown) {
		return gulp.src(config.global.docs + '/_src/**/*.md')
			.pipe(markdown(config.markdown))
			.pipe();
	} else {
		gutil.log(gutil.colors.yellow('markdown disabled'));
	}
});
