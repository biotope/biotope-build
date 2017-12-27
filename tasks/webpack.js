const path = require('path');
const webpackConfig = require('./../webpack.config.js');
const config = require('./../config');
const $ = config.plugins;

$.gulp.task('webpack:ts', function() {
	if (config.global.tasks.webpack) {

		return $.mergeStream(config.global.resources.map( function(currentResource, index) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, currentResource, '**', '*.ts'),
				path.join(config.global.cwd, config.global.src, config.global.components[index], '**', '*.ts')
			];
			const targetPath = path.join(config.global.cwd, config.global.dev);

			config.webpack.ignoreList.forEach(function (ignorePath) {
				sourcePaths.push('!' + path.join(config.global.cwd, config.global.src, ignorePath));
			});

			return $.gulp.src(sourcePaths, { base: path.join(config.global.cwd, config.global.src) })
				.pipe($.vinylNamed(function(file) {
					const currentResourceParsed = path.parse(currentResource);
					let relativePath = path.relative(file.base, file.path);

					if(!relativePath.startsWith(currentResourceParsed.name)) {
						relativePath = path.join(currentResourceParsed.name, relativePath);
					}

					if(relativePath.endsWith('.ts')) {
						relativePath = relativePath.slice(0, -3);
					}

					return relativePath;
				}))
				.pipe($.webpackStream(webpackConfig, $.webpack).on('error', function() {
					this.emit('end');
				}))
				.pipe($.gulp.dest(targetPath));

		}));

	} else {
		console.log($.colors.yellow('webpack:ts disabled'));
	}
});

$.gulp.task('watch:webpack:ts', function () {

	if (config.global.tasks.webpack) {
		config.global.resources.forEach(function (currentResource, index) {

			const sourcePaths = [
				path.join(config.global.cwd, config.global.src, currentResource, '**', '*.ts'),
				path.join(config.global.cwd, config.global.src, config.global.components[index], '**', '*.ts')
			];

			$.watch(sourcePaths, config.watch, function () {
				$.runSequence(
					'webpack:ts'
				);
			});
		});
	}
});
