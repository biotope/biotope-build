const gulp = require('gulp');
const config = require('./../config');

gulp.task('convertIconsToSprites', function() {
    const runSequence = require('run-sequence');
    
	runSequence('compileSvg', 'copySvgFile');
})

gulp.task('compileSvg', function () {
	const svgSprite = require('gulp-svg-sprites');
S
	return gulp.src(config.global.src + config.global.resources + '/icons/*.svg')
		.pipe(svgSprite({
			baseSize: 20,
			cssFile: '../../scss/fonts/_sprite.scss',
			svg: {
				sprite: "svg/sprite.svg"
			},
			preview: false
		}))
		.pipe(gulp.dest(config.global.src + config.global.resources + '/icons/sprite'));
});

gulp.task('copySvgFile', function() {
	return gulp.src(config.global.src + config.global.resources + '/icons/sprite/svg/sprite.svg')
		.pipe(gulp.dest(config.global.dev + config.global.resources + '/svg'));
});
