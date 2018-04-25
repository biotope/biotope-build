const gulp = require('gulp');
const config = require('./../config');
const path = require('path');
const webpackSourcePatterns = [
    path.join(config.global.cwd, config.global.src, config.global.resources, '**', '*.ts'),
    path.join(config.global.cwd, config.global.src, config.global.components, '**', '*.ts'),
	path.join(config.global.cwd, config.global.src, config.global.components, '**', '*.scss')
];
const webpackWatchPatterns = [
	...webpackSourcePatterns,
	path.join(config.global.cwd, config.global.src, config.global.components, '**', '*.scss')
];

gulp.task('webpack:ts', function (cb) {
    if (config.global.tasks.webpack) {
        const named = require('vinyl-named');
        const plumber = require('gulp-plumber');
        const webpack = require('webpack');
        const webpackStream = require('webpack-stream');
        const webpackConfig = require('./../webpack.config.js');

        config.webpack.ignoreList.forEach((ignorePath) => {
            webpackSourcePatterns.push('!' + path.join(config.global.cwd, config.global.src, ignorePath));
        });

        // // Left this for later research
        // const pump = require('pump');
        // pump([
        // 	gulp.src(webpackSourcePatterns, { base: path.join(config.global.cwd, config.global.src) }),
        // 	named((file) => {
        // 		const currentResourceParsed = path.parse(config.global.resources);
        // 		let relativePath = path.relative(file.base, file.path);
        //
        // 		if(!relativePath.startsWith(currentResourceParsed.name)) {
        // 			relativePath = path.join(currentResourceParsed.name, relativePath);
        // 		}
        //
        // 		if(relativePath.endsWith('.ts')) {
        // 			relativePath = relativePath.slice(0, -3);
        // 		}
        //
        // 		return relativePath;
        // 	}),
        // 	webpackStream(webpackConfig, webpack),
        // 	gulp.dest( path.join(config.global.cwd, config.global.dev) )
        // ], cb);

        return gulp.src(webpackSourcePatterns, {base: path.join(config.global.cwd, config.global.src)})
            .pipe(plumber())
            .pipe(named((file) => {
                const currentResourceParsed = path.parse(config.global.resources);
                let relativePath = path.relative(file.base, file.path);

                if (!relativePath.startsWith(currentResourceParsed.name)) {
                    relativePath = path.join(currentResourceParsed.name, relativePath);
                }

                if (relativePath.endsWith('.ts')) {
                    relativePath = relativePath.slice(0, -3);
                }

                return relativePath;
            }))
            .pipe(webpackStream(webpackConfig, webpack))
            .pipe(gulp.dest(path.join(config.global.cwd, config.global.dev)));


    } else {
        const colors = require('colors/safe');
        console.log(colors.yellow('webpack:ts disabled'));
        cb();
    }
});

gulp.task('watch:webpack:ts', function () {
    if (config.global.tasks.webpack) {
        const watch = require('gulp-watch');
        const runSequence = require('run-sequence');

        watch(webpackWatchPatterns, config.watch, function () {
            runSequence('webpack:ts', 'livereload');
        });
    }
});
