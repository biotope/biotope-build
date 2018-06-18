const gulp = require('gulp');
const config = require('./../config');

gulp.task('checkDependencies', function() {
  const colors = require('colors/safe');
  const dependencies = require('check-dependencies');
  const output = dependencies.sync(config.checkDependencies);

  if (output.status === 1) {
    if (output.error.length > 0) {
      for (let i = 0; i < output.error.length; i++) {
        console.log(colors.red(output.error[i]));
      }
    }

    return process.exit(2);
  }

  console.log(
    colors.green('All installed package versions are in sync with package.json')
  );
  return true;
});
