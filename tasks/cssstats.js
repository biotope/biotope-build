const gulp = require('gulp');
const tap = require('gulp-tap');
const colors = require('colors/safe');
const cssstats = require('gulp-cssstats');

const config = require('./../config');

gulp.task('cssstats', function () {

	if (config.global.tasks.cssStats) {
		return gulp.src([
			config.global.dist + '/resources/css/**/*.css'
		])
			.pipe(cssstats())
			.pipe(tap(function (file) {
				const stats = JSON.parse(file.contents.toString());
				const filepath = file.path.substr(0, file.path.length - 4) + 'css';

				console.log(colors.blue(`CSS Stats for ${filepath}`));
				console.log(colors.green(`Minified: ${(stats.size / 1024).toFixed(2)} KB`));
				console.log(colors.green(`Gzipped: ${(stats.gzipSize / 1024).toFixed(2)} KB`));

				// IE9 selector limit
				if (stats.selectors.total > 4096) {
					console.log(colors.red(`Too much selectors for IE9 (${stats.selectors.total} Selectors) in ${filepath}`));

					if(config.cssstats.exit) {
					    process.exit(1);
                    }
				} else {
					console.log(colors.green(`Selectors: ${stats.selectors.total}`));
				}
			}));
	} else {
		console.log(colors.yellow('cssStats disabled'));
	}
});
