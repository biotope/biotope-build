var gulp = require('gulp');
var nightwatch = require('gulp-nightwatch');
var argv = require('yargs').argv;

gulp.task('test', function() {
	return gulp.src("./test/nightwatch/tests/*.js")
		.pipe(nightwatch({
			configFile: 'test/nightwatch/nightwatch.json',
			cliArgs: ['--url ' + argv.url, '--env chrome']
		})).pipe(nightwatch({
			configFile: 'test/nightwatch/nightwatch.json',
			cliArgs: ['--url ' + argv.url, '--env firefox']
		})).pipe(nightwatch({
			configFile: 'test/nightwatch/nightwatch.json',
			cliArgs: ['--url ' + argv.url, '--env ie11']
		}));
});

gulp.task('test:dev', function() {
	return gulp.src("./test/nightwatch/tests/*.js")
		.pipe(nightwatch({
			configFile: 'test/nightwatch/nightwatch.dev.json',
			cliArgs: ['--reporter test/nightwatch/reporter.js',  '--env chrome']
		}));
});
