var gulp = require('gulp');
var tap = require('gulp-tap');
var gutil = require('gulp-util');
var cssstats = require('gulp-cssstats');
var config = require('./../config');

gulp.task('cssstats', function () {

	if (config.global.tasks.cssStats) {
		return gulp.src([
			config.global.dist + '/resources/css/**/*.css'
		])
			.pipe(cssstats())
			.pipe(tap(function (file) {
				var stats = JSON.parse(file.contents.toString());
				var filepath = file.path.substr(0, file.path.length - 4) + 'css';

				gutil.log(gutil.colors.blue('CSS Stats for ' + filepath));
				gutil.log(gutil.colors.green('Minified: ' + (stats.size / 1024).toFixed(2) + ' KB'));
				gutil.log(gutil.colors.green('Gzipped: ' + (stats.gzipSize / 1024).toFixed(2) + ' KB'));

				// IE9 selector limit
				if (stats.selectors.total > 4096) {
					gutil.log(gutil.colors.red('Too much selectors for IE9 (' + stats.selectors.total + ' Selectors) in ' + filepath));
					if(config.cssstats.exit) {
					    process.exit(1);
                    }
				} else {
					gutil.log(gutil.colors.green('Selectors: ' + stats.selectors.total));
				}
			}));
	} else {
		gutil.log(gutil.colors.yellow('cssStats disabled'));
	}
});
