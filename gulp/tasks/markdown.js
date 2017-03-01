var gulp = require('gulp');
var markdown = require('gulp-markdown');
var wrap = require('gulp-wrap');
var gutil = require('gulp-util');
var config = require('./../config');

gulp.task('markdown', function () {

    if (config.global.tasks.markdown) {
        return gulp.src('./readme.md')
            .pipe(markdown(config.markdown))
            .pipe(wrap({ src: config.global.docs + '/resources/wraps/markdown.tpl.html' }))
            .pipe(gulp.dest(config.global.docs));
    } else {
        gutil.log(gutil.colors.yellow('markdown disabled'));
    }
});
