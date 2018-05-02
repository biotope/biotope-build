const gulp = require('gulp');
const config = require('./../config');
const {
	getComponentPathDev,
	getComponentPathDist
} = require('../helper/getComponentPath');

gulp.task('uglify:resources:dist', function (cb) {

	if (config.global.tasks.uglify) {
		const path = require('path');
		const pump = require('pump');
		const uglifyConfig = require('./../pumps/uglify');
		const promises = [];

		config.uglify.folders.forEach((folder) => {
			const srcArray = [
				path.join(config.global.dev, config.global.resources, folder, '/**/*.js')
			];

			config.uglify.ignoreList.forEach((ignorePath) => {
				srcArray.push('!' + path.join(config.global.dev, ignorePath));
			});

			const targetPath = path.join(config.global.dist, config.global.resources, folder);
            const uglifyPump = uglifyConfig.defaultPump(config);
            uglifyPump.unshift(gulp.src(srcArray));
            uglifyPump.push(gulp.dest(targetPath));

			promises.push(new Promise((resolve, reject) => {
				pump(uglifyPump, function(err) {
					if(!err){
						resolve();
					}else{
						reject(err);
					}
				});
			}));
		});

		Promise.all(promises).then(() => {
			cb();
		});

	} else {
		const colors = require('colors/safe');
		console.log(colors.yellow('uglify resources disabled'));
        cb();
	}
});


gulp.task('uglify:components:dist', function (cb) {

	if (config.global.tasks.uglify) {
		const path = require('path');
		const pump = require('pump');
        const uglifyConfig = require('./../pumps/uglify');

		const srcArray = [
			path.join(getComponentPathDev(), '/**/*.js')
		];

		config.uglify.ignoreList.forEach((ignorePath) => {
			srcArray.push('!' + path.join(config.global.dev, ignorePath));
		});

        const targetPath = getComponentPathDist();
        const uglifyPump = uglifyConfig.defaultPump(config);
        uglifyPump.unshift(gulp.src(srcArray));
        uglifyPump.push(gulp.dest(targetPath));

		pump(uglifyPump, cb);

	} else {
		const colors = require('colors/safe');
		console.log(colors.yellow('uglify components disabled'));
        cb();
	}
});

