const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('clean:dev', function () {
	return $.del([
		path.join(config.global.cwd, config.global.dev)
	]);
});

$.gulp.task('clean:dist', function () {
	return $.del([
		path.join(config.global.cwd, config.global.dist)
	]);
});

$.gulp.task('clean:useref', function () {
	return $.del([
		path.join(config.global.cwd, config.global.dist, '_useref.html')
	]);
});

$.gulp.task('clean:iconfont', function () {
	return $.del([
		path.join(config.global.cwd, '.iconfont')
	]);
});
