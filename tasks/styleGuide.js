const gulp = require('gulp');
const config = require('./../config');
const path = require('path');
const fs = require('fs');

gulp.task('styleGuide', function(cb) {
  if(config.global.tasks.styleGuide) {
    const mkdirSync = function (dirPath) {
      try {
        fs.mkdirSync(dirPath);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }
    };

    const fromDir = (startPath, filter) => {
      if (!fs.existsSync(startPath)) {
        console.log('no dir ', startPath);
        return;
      }

      const files = fs.readdirSync(startPath);
      return files.reduce((aggregated, filename) => {
        const filePath = path.join(startPath, filename);
        const stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
          return [
            ...aggregated,
            ...fromDir(filePath, filter)
          ];
        } else if (filter.test(filePath)) {
          return [
            ...aggregated,
            filePath
          ];
        } else {
          return [...aggregated];
        }
      },[]);
    };

    const mergeComponentDefinitions = (origin) => {
      let dir = config.global.dev;
      if (!fs.existsSync(dir)) {
        mkdirSync(dir);
      }
      dir = path.join(config.global.dev, config.styleGuide.variantDistFolderName);
      if (!fs.existsSync(dir)) {
        mkdirSync(dir);
      }

      const packages = fromDir(origin, /package\.json$/);
      const contents = packages.map((packageUrl) => {
        const packageData = JSON.parse(fs.readFileSync(packageUrl, 'utf8'));
        const packageDateClean = {};
        packageDateClean.name = packageData.name;
        packageDateClean.category = packageData.category;
        packageDateClean.keywords = packageData.keywords;
        packageDateClean.status = packageData.status;
        return packageDateClean;
      });
      return contents.map(content => content);
    };

    const writeComponentDefinitionsFromTo = (origin, target) => {
      fs.writeFileSync(target, JSON.stringify(mergeComponentDefinitions(origin))
        .replace(/\\n/g, '')
        .replace(/\\r/g, '')
        .replace(/\\t/g, '')
      );
    };
    writeComponentDefinitionsFromTo(config.styleGuide.scanPath, path.join(config.global.dev, config.styleGuide.outputFileName));
  }
  cb();
});
