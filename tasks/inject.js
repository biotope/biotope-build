const gulp = require('gulp');
const inject = require('gulp-inject');
const config = require('./../config');

gulp.task('inject', function () {
	if (config.global.tasks.favicons) {
		return gulp.src(config.global.dist + '/*.html')
			.pipe(inject(gulp.src([config.global.dist + '/favicons/htmlhead.favicons.html']), {
				starttag: '<!-- inject:head:{{ext}} -->',
				transform: function (filePath, file) {
					// return file contents as string
					return file.contents.toString('utf8')
				}
			}))
			.pipe(gulp.dest(config.global.dist));
	}
});
