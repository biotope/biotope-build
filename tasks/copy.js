const gulp = require('gulp');
const path = require('path');
const config = require('./../config');
const copyFiles = (from, to) => {
  return gulp
    .src(from)
    .pipe(gulp.dest(to));
};


gulp.task('copy:dev:js', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.resources,
    'js',
    '**',
    '*.js'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dev,
    config.global.resources,
    'js'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dev:components:js', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.components,
    '**',
    '*.js'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dev,
    config.global.resources,
    config.global.components
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:js', function () {
  const from = path.join(
    config.global.cwd,
    config.global.dev,
    config.global.resources,
    'js',
    '**',
    '*.js'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'js'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:react', function () {
  const from = path.join(
    config.global.cwd,
    config.global.dev,
    config.global.resources,
    'react',
    '**',
    '*.js'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'react'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:ts', function () {
  const from = path.join(
    config.global.cwd,
    config.global.dev,
    config.global.resources,
    'ts',
    '**',
    '*.js'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'ts'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:components', function () {
  const from = path.join(
    config.global.cwd,
    config.global.dev,
    config.global.resources,
    config.global.components,
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    config.global.components
  );

  return copyFiles(from, to);
});

gulp.task('copy:dev:npm:js', function () {
  const mergeStream = require('merge-stream');
  const filter = require('gulp-filter');
  const resources = config.global.externalResources;

  if (Object.keys(resources).length === 0 && resources.constructor === Object) {
    return;
  }

  return mergeStream(
    Object.keys(resources).map(function (key) {
      if (typeof resources[key] === 'string') {
        resources[key] = [resources[key]];
      }

      return mergeStream(
        resources[key].map(function (file) {
          return gulp
            .src(config.global.node + '/' + key + '/' + file)
            .pipe(filter('**/*.js'))
            .pipe(
              gulp.dest(
                config.global.dev + config.global.resources + '/js/vendor/'
              )
            );
        })
      );
    })
  );
});

gulp.task('copy:dev:npm:css', function () {
  const mergeStream = require('merge-stream');
  const filter = require('gulp-filter');
  const resources = config.global.externalResources;

  if (Object.keys(resources).length === 0 && resources.constructor === Object) {
    return;
  }

  return mergeStream(
    Object.keys(resources).map(function (key) {
      if (typeof resources[key] === 'string') {
        resources[key] = [resources[key]];
      }

      return mergeStream(
        resources[key].map(function (file) {
          return gulp
            .src(config.global.node + '/' + key + '/' + file)
            .pipe(filter('**/*.css', '**/*.scss'))
            .pipe(
              gulp.dest(
                config.global.dev + config.global.resources + '/css/vendor/'
              )
            );
        })
      );
    })
  );
});

/**
 * backwards compatibility for bower components
 * dev copy task
 */
gulp.task('copy:dev:npm:bower', function () {
  const mergeStream = require('merge-stream');
  const bowerResources = config.global.bowerResources;

  if (
    Object.keys(bowerResources).length === 0 &&
    bowerResources.constructor === Object
  ) {
    return;
  }

  return mergeStream(
    Object.keys(bowerResources).map(function (key) {
      if (typeof bowerResources[key] === 'string') {
        bowerResources[key] = [bowerResources[key]];
      }

      return mergeStream(
        bowerResources[key].map(function (file) {
          const paths = file.split('/');
          paths.pop();

          const filePath = path.join(key, ...paths);

          return gulp
            .src(config.global.node + '/' + key + '/' + file)
            .pipe(
              gulp.dest(
                config.global.dev +
                config.global.resources +
                '/bower_components/' +
                filePath
              )
            );
        })
      );
    })
  );
});

/**
 * backwards compatibility for bower
 * dist copy task
 */
gulp.task('copy:dist:bower', function () {
  const from = path.join(
    config.global.cwd,
    config.global.dev,
    config.global.resources,
    'bower_components',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'bower_components'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:flash', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.resources,
    'flash',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'flash'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:json', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.resources,
    'json',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'json'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:fonts', function () {
  const from = [
    path.join(
      config.global.cwd,
      config.global.src,
      config.global.resources,
      'fonts',
      '**',
      '*'
    ),
    path.join(
      config.global.cwd,
      config.global.dev,
      config.global.resources,
      'fonts',
      '**',
      '*'
    )
  ];
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'fonts'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:resources:img', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.resources,
    'img',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'img'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:components:img', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.components,
    '**',
    'img',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    config.global.components
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:assets', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    '_assets',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    '_assets'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:css', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.resources,
    'css',
    '**',
    '*.css'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'css'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:mock', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    '_mock',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    '_mock'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:component:mock', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.components,
    '**',
    '_mock',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.components
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:component:data', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.components,
    '**',
    'data',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.components
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:config', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    '_config',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    '_config'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:hbs', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.resources,
    'templates',
    '**',
    '*'
  );
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'templates'
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:svgSprite', function () {
  const from = [
    path.join(
      config.global.cwd,
      config.global.src,
      config.global.resources,
      'svg',
      '**',
      '*'
    ),
    path.join(
      config.global.cwd,
      config.global.dev,
      config.global.resources,
      'svg',
      '**',
      '*'
    )
  ];
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    'svg'
  );

  return copyFiles(from, to);
});

gulp.task('watch:components:js', function () {
  const watch = require('gulp-watch');
  const runSequence = require('run-sequence');

  watch(
    path.join(
      config.global.cwd,
      config.global.src,
      config.global.components,
      '**',
      '*.js'
    ),
    config.watch,
    function () {
      runSequence(['copy:dev:components:js']);
    }
  );
});
