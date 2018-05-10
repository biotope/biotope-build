const gulp = require('gulp');
const config = require('./../config');
const path = require('path');
const typescriptSourcePatterns = [
    path.join(config.global.cwd, config.global.src, config.global.resources, '**', '*.ts'),
    path.join(config.global.cwd, config.global.src, config.global.components, '**', '*.ts')
];
const typescriptWatchPatterns = [
	...typescriptSourcePatterns
];

gulp.task('typescript', function (cb) {
    if (config.global.tasks.typescript) {
        const plumber = require('gulp-plumber');
        const rename = require('gulp-rename');
        const rollupStream = require('gulp-rollup-stream');
        const rollupTypescript = require('rollup-plugin-typescript2');

        config.typescript.ignoreList.forEach((ignorePath) => {
            typescriptSourcePatterns.push('!' + path.join(config.global.cwd, config.global.src, ignorePath));
        });

        return gulp.src(typescriptSourcePatterns, {base: path.join(config.global.cwd, config.global.src)})
            .pipe(plumber())
            .pipe(rollupStream({
                plugins: [
                    rollupTypescript()
                ],
                output: {
                    format: 'iife'
                }
            }))
            .pipe(rename((path) => {
                path.extname = ".js"
            }))
            .pipe(gulp.dest(path.join(config.global.cwd, config.global.dev)))


    } else {
        const colors = require('colors/safe');
        console.log(colors.yellow('typescript disabled'));
        cb();
    }
});

gulp.task('watch:typescript', function () {
    if (config.global.tasks.typescript) {
        const watch = require('gulp-watch');
        const runSequence = require('run-sequence');

        watch(typescriptWatchPatterns, config.watch, function () {
            runSequence('typescript', 'livereload');
        });
    }
});
