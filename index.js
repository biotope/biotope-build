const gulp = require('gulp');
const runSequence = require('run-sequence');
const requireDir = require('require-dir');
requireDir('./tasks', {recurse: true});

// Prevent errors caused by too many listeners in gulp-watch
require('events').EventEmitter.defaultMaxListeners = 0;

// configure default task
gulp.task('default', ['serve']);


// build templates for development
gulp.task('build:dev', function (callback) {
	runSequence(
		'checkDependencies',
		[
			'clean:dev',
			'clean:iconfont'
		],
		[
			'lint:resources:sass',
			'lint:components:sass',
			'lint:json',
			// 'jshint:resources',
			// 'jshint:components',
			'eslint:resources',
			'eslint:components',
			'iconfont',
			'copy:dev:npm:js',
			'copy:dev:npm:css',
			'copy:dev:npm:bower'
		],
		[
			'handlebars'
		],
		[
			'static:hb',
			'static:hb:indexr',
			'browserSupport'
		],
		[
			'resources:sass',
			'components:sass',
			'webpack:ts',
			'copy:dev:components:js'
		],
		[
			'modernizr',
			'htmlhint'
		],
		callback
	);
});


// build templates for production
gulp.task('build', function (callback) {
	runSequence(
		[
			'clean:dist',
			'build:dev'
		],
		[
			'copy:dev:js'
		],
		[
			'copy:dist:js',
			'copy:dist:react',
			'copy:dist:ts',
			'copy:dist:flash',
			'copy:dist:json',
			'copy:dist:fonts',
			'copy:dist:resources:img',
			'copy:dist:components:img',
			'copy:dist:assets',
			'copy:dist:css',
			'copy:dist:mock',
			'copy:dist:component:mock',
			'copy:dist:config',
			'copy:dist:hbs',
			'copy:dist:bower'
		],
		[
			'uglify:resources:dist',
			'uglify:components:dist',
			'cleanCss:resources:dist',
			'cleanCss:components:dist'
		],
		[
			'useref'
		],
		[
			'useref:assets',
			'image:resources:dist',
			'image:component:dist',
			'favicons'
		],
		[
			'inject',
			'clean:useref',
			'cssstats',
			'version'
		],
		callback
	);
});


// serve development templates
gulp.task('serve', function (callback) {
	runSequence(
		'build:dev',
		[
			'watch:browserSupport',
			'watch:static:hb:indexr',
			'watch:components:js',
			'watch:components:sass',
			'watch:resources:sass',
			// 'watch:jshint:components',
			// 'watch:jshint:resources',
			'watch:eslint:components',
			'watch:eslint:resources',
			'watch:handlebars',
			'watch:json',
			'watch:html',
			'watch:webpack:ts',
			'watch:static:hb',
			'watch:icons'
			// 'watch:livereload'
		],
		'connect',
		'connect:open',
		callback
	);
});


// serve production templates
gulp.task('serve:dist', function (callback) {
	runSequence(
		'build',
		callback
	);
});

module.exports = gulp.tasks;
