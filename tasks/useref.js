const path = require('path');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('useref', function () {

	const sourcePaths = path.join(config.global.cwd, config.global.dev, '*.html');
	const targetPath = path.join(config.global.cwd, config.global.dist);

	return $.gulp.src(sourcePaths)
		.pipe($.lineEndingCorrector(config.lec))
		.pipe($.useref({
			noAssets: true
		}))
		.pipe($.filter(['**/*.html']))
		.pipe($.gulp.dest(targetPath));

});

$.gulp.task('useref:assets', function () {

	const hbsParser = require('./../lib/hbs-parser');
	const jsFilter = $.filter(['**/*.js'], {restore: true});
	const cssFilter = $.filter(['**/*.css'], {restore: true});
	const sourcePaths = path.join(config.global.cwd, config.global.src, 'resources', '_useref.html');
	const targetPath = path.join(config.global.cwd, config.global.dist);
	const cleanCssPipe = require('../pipes/cleanCss');

	const hbStream = hbsParser.createHbsGulpStream(
		[
			path.join(config.global.cwd, config.global.src, '**', '*.hbs'),
			'!' + path.join(config.global.cwd, config.global.src, 'pages', '**')
		],
		null, null, config.global.debug
	);

	return $.gulp.src(sourcePaths)
		.pipe($.lineEndingCorrector(config.lec))
		.pipe(hbStream)
		.pipe($.useref())

		.pipe(jsFilter)
		.pipe($.uglify(config.uglify))
		.pipe(jsFilter.restore)

		.pipe(cssFilter)
		.pipe(cleanCssPipe())
		.pipe(cssFilter.restore)

		.pipe($.filter(['**', '!**/_useref.html']))

		.pipe($.gulp.dest(targetPath));

});
