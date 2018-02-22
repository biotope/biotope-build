const gulp = require('gulp');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cached = require('gulp-cached');
const watch = require('gulp-watch');
const colors = require('colors/safe');
const runSequence = require('run-sequence');
const mergeStream = require('merge-stream');
const sourcemaps = require('gulp-sourcemaps');

const config = require('./../config');

gulp.task('resources:sass', function () {
	if (config.global.tasks.sass) {
		return gulp.src([
			config.global.src + config.global.resources + '/scss/**/*.scss',
			'!' + config.global.src + config.global.resources + '/scss/**/_*.scss'
		])
			.pipe(sourcemaps.init())
			.pipe(sass(config.sass).on('error', sass.logError))
			.pipe(postcss([
				autoprefixer(config.autoprefixer)
			]))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(config.global.dev + config.global.resources + '/css'));
	} else {
		console.log(colors.yellow('sass resources disabled'));
	}
});

/**
 * compiles scss files
 * from app/partials/components/../
 * to .tmp/resources/components/css/
 */

gulp.task('components:sass', function () {
	if (config.global.tasks.sass) {
		return gulp.src([
			config.global.src + config.global.components + '/**/*.scss',
			'!' + config.global.src + config.global.components + '/**/_*.scss'
		])
			.pipe(sourcemaps.init())
			.pipe(sass(config.sass).on('error', sass.logError))
			.pipe(postcss([
				autoprefixer(config.autoprefixer)
			]))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(config.global.dev + config.global.resources + config.global.components));
	} else {
		console.log(colors.yellow('sass components disabled'));
	}
});

/**
 * scss file liniting
 * @TODO throws warnings now, define linting rules
 */
gulp.task('lint:resources:sass', function () {
	if (config.global.tasks.sass && config.global.tasks.linting && false) {
		return gulp.src([config.global.src + config.global.resources + '/scss/**/*.s+(a|c)ss',
			'!' + config.global.src + config.global.resources + '/scss/**/_icons.s+(a|c)ss',
		])
			.pipe(cached('sass', { optimizeMemory: true }))
			.pipe(sassLint(config.global.sassLint))
			.pipe(sassLint.format())
			.pipe(sassLint.failOnError());
	}
});

gulp.task('lint:components:sass', function () {
	if (config.global.tasks.sass && config.global.tasks.linting && false) {
		return gulp.src(config.global.src + config.global.components + '/**/*.s+(a|c)ss')
			.pipe(cached('sass', { optimizeMemory: true }))
			.pipe(sassLint())
			.pipe(sassLint.format())
			.pipe(sassLint.failOnError());
	}
});

/**
 * watches global scss files for any changes
 */
gulp.task('watch:resources:sass', function () {
	if (config.global.tasks.sass) {
		watch([
			config.global.src + config.global.resources + '/scss/**/*.scss'
		], config.watch, function() {
			runSequence(
				['lint:resources:sass'],
				['resources:sass'],
				['livereload']
			);
		});

		watch([
			config.global.src + '../.iconfont' + '/*.scss'
		], config.watch, function() {
			runSequence(
				['lint:resources:sass'],
				['resources:sass'],
				['livereload']
			);
		});
	}
});

/**
 * watches component scss files for any changes
 */
gulp.task('watch:components:sass', function () {
	if (config.global.tasks.sass) {
		let components = [];
		components.push(config.global.src + config.global.components + '/**/*.scss');

		watch(components, config.watch, function() {
			runSequence(
				['lint:components:sass'],
				['components:sass'],
				['resources:sass'],
				['livereload']
			);
		});
	}
});
