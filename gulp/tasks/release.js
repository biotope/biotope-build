var gulp = require('gulp');
var bump = require('gulp-bump');
var git  = require('gulp-git');
var gutil = require('gulp-util');
var filter = require('gulp-filter');
var exec = require('child_process').exec;
var argv = require('yargs')
	.option('type', {
		alias: 't',
		choices: ['patch', 'minor', 'major', 'prerelease']
	}).argv;
var tag = require('gulp-tag-version');
var push = require('gulp-git-push');
var fs = require('fs');
var runSequence = require('run-sequence');
var packageOld;

/**
 *  Bumping and tagging version, and pushing changes to repository.
 *
 *  You can use the following commands:
 *      gulp release --type=patch   # makes: v1.0.0 → v1.0.1
 *      gulp release --type=minor   # makes: v1.0.0 → v1.1.0
 *      gulp release --type=major   # makes: v1.0.0 → v2.0.0
 *      gulp release --type=prerelease   # makes: v1.0.0 → v1.0.0-1
 *
 *  Please read http://semver.org/ to understand which type to use.
 *
 *  The 'gulp release' task is an example of a release task for a NPM package.
 **/

gulp.task('bump', function(cb) {

	packageOld = JSON.parse(fs.readFileSync('./package.json'));

	return gulp.src(['./package.json'])
		// bump package.json
		.pipe(bump({
			type: argv.type || 'patch'
		}))
		// save the bumped files into filesystem
		.pipe(gulp.dest('./'))
		// commit the changed files
		.pipe(git.commit('VERSION TAGGED'))
		// filter one file
		.pipe(filter('package.json'))
		// create tag based on the filtered file
		.pipe(tag())
});

gulp.task('gitcommit', function() {
	return gulp.src('./app/*')
		.pipe(git.add());
});

gulp.task('diff', function() {
	git.exec({args: 'diff v' + packageOld.version + ' --> diff.diff'}, function (err, stdout) {
		if (err) throw err;
	});
});

gulp.task('release', function (callback) {
	runSequence(
		'gitcommit',
		'bump',
		'diff',
		function (error) {
			if (error) {
				console.log(error.message);
			} else {
				console.log('RELEASE FINISHED SUCCESSFULLY');
			}
			callback(error);
		});
});
