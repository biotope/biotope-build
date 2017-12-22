const config = require('./../config');
const $ = config.plugins;

$.gulp.task('useref', function () {

	return $.gulp.src(config.global.dev + '/*.html')
		.pipe($.lineEndingCorrector(config.lec))
		.pipe($.useref({
			noAssets: true
		}))
		.pipe($.filter(['**/*.html']))
		.pipe($.gulp.dest(config.global.dist));

});

$.gulp.task('useref:assets', function () {

	const hbsParser = require('./../lib/hbs-parser');
	const jsFilter = $.filter(['**/*.js'], {restore: true});
	const cssFilter = $.filter(['**/*.css'], {restore: true});

	let hbStream = hbsParser.createHbsGulpStream(
		[
			config.global.src + '/**/*.hbs',
			'!' + config.global.src + '/pages/**'
		],
		null, null, config.global.debug
	);

	return $.gulp.src(config.global.src + '/resources/_useref.html')
		.pipe($.lineEndingCorrector(config.lec))
		.pipe(hbStream)
		.pipe($.useref())

		.pipe(jsFilter)
		.pipe($.uglify(config.uglify))
		.pipe(jsFilter.restore)

		.pipe(cssFilter)
		.pipe($.cleanCss(config.cleanCss))
		.pipe(cssFilter.restore)

		.pipe($.filter(['**', '!**/_useref.html']))

		.pipe($.gulp.dest(config.global.dist));
});
