const gulp = require('gulp');
const path = require('path');
const config = require('./../config');
const copyFiles = (from, to) => {
  return gulp
    .src(from)
    .pipe(gulp.dest(to));
};

const ignoreTS = path.join(
  config.global.cwd,
  config.global.src,
  config.global.components,
  '**',
  '*.ts'
);
const ignoreScss = path.join(
  config.global.cwd,
  config.global.src,
  config.global.components,
  '**',
  '*.scss'
);

const componentsFilesGlobPattern = [
  path.join(
    config.global.cwd,
    config.global.src,
    config.global.components,
    '**',
    '*'
  ),
  `!${path.join(
    config.global.cwd,
    config.global.src,
    config.global.components,
    '**',
    '_*'
  )}`,
  `!${path.join(
    config.global.cwd,
    config.global.src,
    config.global.components,
    '**',
    '_*',
    '**'
  )}`,
  `!${ignoreTS}`,
  `!${ignoreScss}`
];

gulp.task('copy:dev:components:files', function () {
  const from = componentsFilesGlobPattern;
  const to = path.join(
    config.global.cwd,
    config.global.dev,
    config.global.resources,
    config.global.components
  );

  return copyFiles(from, to);
});

gulp.task('copy:dev:resources:js', function () {
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

gulp.task('copy:dist:components:files', function () {
  const from = componentsFilesGlobPattern;
  const to = path.join(
    config.global.cwd,
    config.global.dist,
    config.global.resources,
    config.global.components
  );

  return copyFiles(from, to);
});

gulp.task('copy:dist:resources:js', function () {
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

gulp.task('copy:dist:resources:react', function () {
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

gulp.task('copy:dist:resources:ts-js', function () {
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

gulp.task('copy:dist:resources:components', function () {
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

gulp.task('copy:dist:resources:json', function () {
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

gulp.task('copy:dist:resources:fonts', function () {
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

gulp.task('copy:dist:resources:assets', function () {
  const from = path.join(
    config.global.cwd,
    config.global.src,
    config.global.resources,
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

gulp.task('copy:dist:resources:css', function () {
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

gulp.task('copy:dist:resources:hbs', function () {
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

gulp.task('watch:components:files', function () {
  const watch = require('gulp-watch');
  const runSequence = require('run-sequence');
  watch(
    componentsFilesGlobPattern,
    config.watch,
    function () {
      runSequence(['copy:dev:components:files']);
    }
  );
});
