const gulp = require('gulp');
const config = require('./../config');
const path = require('path');
const globule = require('globule');
const plumber = require('gulp-plumber');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./../webpack.config.js');

const webpackDefaultSourcePatterns = [
  path.join(
    config.global.cwd,
    config.global.src,
    config.global.resources,
    '**',
    '*.ts'
  ),
  path.join(
    config.global.cwd,
    config.global.src,
    config.global.components,
    '**',
    '*.ts'
  )
];

const webpackSourcePatterns = config.global.tsEntryPoints ? config.global.tsEntryPoints.map((cPath) => path.join(
  config.global.cwd,
  cPath
)) : webpackDefaultSourcePatterns;

const webpackWatchPatterns = [
  ...webpackSourcePatterns
];

if (config.webpack.watchScss) {
  webpackWatchPatterns.push(
    path.join(
      config.global.cwd,
      config.global.src,
      config.global.components,
      '**',
      '*.scss'
    )
  );
}

gulp.task('webpack:ts', function (cb) {
  if (config.global.tasks.webpack) {

    config.webpack.ignoreList.forEach(ignorePath => {
      webpackSourcePatterns.push(
        `!${path.join(config.global.cwd, config.global.src, ignorePath)}`
      );
    });

    const entryPoints = globule.find(webpackSourcePatterns);

    if (entryPoints.length) {
      webpackConfig.entry = {};

      for (const entryPoint of entryPoints) {
        const currentResourceParsed = path.parse(config.global.resources);
        let relativePath = path.relative(path.join(config.global.cwd, config.global.src), entryPoint);

        if (!relativePath.startsWith(currentResourceParsed.name)) {
          relativePath = path.join(currentResourceParsed.name, relativePath);
        }

        if (relativePath.endsWith('.ts')) {
          relativePath = relativePath.slice(0, -3);
        }

        webpackConfig.entry[relativePath] = entryPoint;
      }

      return gulp.src(path.join(config.global.cwd, 'gulpfile.js'), { read: false })
        .pipe(plumber())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(path.join(config.global.cwd, config.global.dev)));

    } else {
      const colors = require('colors/safe');
      console.log(colors.yellow('webpack: no entry points found - skipping this task'));
      cb();
    }

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
