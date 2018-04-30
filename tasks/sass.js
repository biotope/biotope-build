const gulp = require('gulp');
const config = require('./../config');
const {
	getComponentPathSrc,
	getComponentPathDev
} = require('../helper/getComponentPath');

gulp.task('resources:sass', function () {
	if (config.global.tasks.sass) {
		const sass = require('gulp-sass');
		const postcss = require('gulp-postcss');
		const autoprefixer = require('autoprefixer');
		const sourcemaps = require('gulp-sourcemaps');

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
		const colors = require('colors/safe');
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
		const sass = require('gulp-sass');
		const postcss = require('gulp-postcss');
		const autoprefixer = require('autoprefixer');
		const sourcemaps = require('gulp-sourcemaps');

		return gulp.src([
			getComponentPathSrc() + '/**/*.scss',
			'!' + getComponentPathSrc() + '/**/_*.scss'
		])
			.pipe(sourcemaps.init())
			.pipe(sass(config.sass).on('error', sass.logError))
			.pipe(postcss([
				autoprefixer(config.autoprefixer)
			]))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(getComponentPathDev()));
	} else {
		const colors = require('colors/safe');
		console.log(colors.yellow('sass components disabled'));
	}
});

/**
 * scss file liniting
 * @TODO throws warnings now, define linting rules
 */
gulp.task('lint:resources:sass', function () {
	if (config.global.tasks.sass && config.global.tasks.linting && false) {
		const sassLint = require('gulp-sass-lint');
		const cached = require('gulp-cached');

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
		const sassLint = require('gulp-sass-lint');
		const cached = require('gulp-cached');

		return gulp.src(getComponentPathSrc() + '/**/*.s+(a|c)ss')
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
		const watch = require('gulp-watch');
		const runSequence = require('run-sequence');

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
		const watch = require('gulp-watch');
		const runSequence = require('run-sequence');
		const components = [];
		components.push(getComponentPathSrc() + '/**/*.scss');

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
