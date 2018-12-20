const gulp = require('gulp');
const config = require('./../config');
const path = require('path');
const fs = require('fs');

gulp.task('styleGuide', function () {
  if (config.global.tasks.styleGuide) {

    const handlebars = require('handlebars');
    const bioHelpers = require('./../lib/hb2-helpers');

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
          return [
            ...aggregated
          ];
        }
      }, []);
    };

    const mergeComponentDefinitions = (origin) => {
      bioHelpers(handlebars);
      mkdirSync(path.resolve(config.styleGuide.distFolder));
      const packageFiles = fromDir(origin, /package\.json$/);
      const contents = packageFiles.map((packageFile) => {
        let expandedPackage = packageFile;
        const packageUrl = packageFile;
        expandedPackage = JSON.parse(fs.readFileSync(packageUrl, 'utf8'));
        expandedPackage.biotope.componentVariants.forEach((variant, index) => {
          let variantUrl = packageUrl.replace('package.json', '');
          variantUrl = variantUrl + variant.file.replace('/', '\\');
          const url = config.styleGuide.distFolder + expandedPackage.name + '.' + variant.file.replace('.hbs', '.html').replace('variants/', '');
          expandedPackage.biotope.componentVariants[index].url = url;

          fs.readFile(variantUrl, 'utf8', (err, data) => {
            let result;
            let template;
            try {
              template = handlebars.compile(data);
              result = template({});
            } catch (err) {
              result = data;
            }
            fs.writeFileSync(url, result);
          });
        });
        return expandedPackage;
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
    writeComponentDefinitionsFromTo(config.styleGuide.scanPath, config.styleGuide.outputFile);
  }
});
