var gulp = require('gulp');
var config = require('./../config');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');

gulp.task('main-bower-files:js', function() {
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(gulp.dest(config.global.dev + '/resources/js/vendor'));
});

gulp.task('main-bower-files:css', function() {
    return gulp.src(mainBowerFiles('**/*.css'))
        .pipe(gulp.dest(config.global.dev + '/resources/css/vendor'));
});

gulp.task('main-bower-files', function () {
    runSequence(
        "main-bower-files:js",
        "main-bower-files:css"
    );
});
