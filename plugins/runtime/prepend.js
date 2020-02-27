const { resolve } = require('path');
const MagicString = require('magic-string');

const getPrependConfig = (runtime, extensions) => ({
  string: typeof runtime === 'string' ? runtime : undefined,
  object: typeof runtime !== 'string' ? runtime : undefined,
  extensions,
  nodeModules: true,
});

const getFlatObject = (object, currentPath = '') => Object.keys(object).reduce((acc, key) => {
  const newPath = `${currentPath}${currentPath ? '.' : ''}${key}`;
  return {
    ...acc,
    [newPath]: object[key] !== undefined ? JSON.stringify(object[key]) : 'undefined',
    ...(typeof object[key] === 'object' && object[key] !== null ? getFlatObject(object[key], newPath) : {}),
  };
}, {});

const createRegex = (variable) => new RegExp(`(?<![A-z0-9\\._$€])${variable.split('.').join('\\.')}(?![A-z0-9_$€])`, 'g');

const isBetween = (needleIndex, haystack, left, right = left) => {
  let templateStatus = 0;
  let opened = false;
  for (let index = 0; index < needleIndex; index += 1) {
    if (haystack[index] === '\\') {
      index += 1;
    } else if (haystack[index] === '`') {
      templateStatus += 1;
    } else if (templateStatus % 2 === 0) {
      if (!opened && haystack.substr(index, left.length) === left) {
        opened = true;
        index += left.length - 1;
      } else if (opened && haystack.substr(index, right.length) === right) {
        opened = false;
        index += right.length - 1;
      }
    }
  }
  return opened;
};

const findAllMatches = (variable, string) => {
  const regex = createRegex(variable);
  let result = regex.exec(string);
  const locations = [];
  while (result) {
    locations.push(result.index);
    result = regex.exec(string);
  }
  return locations.filter((location) => !(
    isBetween(location, string, '/*', '*/')
    || isBetween(location, string, '//', '\n')
    || isBetween(location, string, '"')
    || isBetween(location, string, '\'')
  ));
};

const prepend = ({
  string, object, extensions, nodeModules,
}) => {
  let flatObject = object && !string ? getFlatObject(object) : null;
  if (flatObject) {
    flatObject = Object.keys(flatObject)
      .filter((key) => key !== 'process')
      .sort((left, right) => {
        const leftNumber = left.match(/./g);
        const rightNumber = right.match(/./g);
        if (leftNumber > rightNumber) {
          return -1;
        }
        if (leftNumber < rightNumber) {
          return 1;
        }
        return 0;
      })
      .reduce((accumulator, key) => ({
        ...accumulator,
        [key]: flatObject[key],
      }), {});
  }

  return {
    name: 'biotope-build-rollup-plugin-prepend',
    transform(code, id) {
      const isInsideNodeModules = id.indexOf(resolve(`${process.cwd()}/node_modules`)) === 0;
      if (
        (!string && !object)
        || (!nodeModules && isInsideNodeModules)
        || (extensions ? !(new RegExp(`(${extensions.join('|')})$`)).test(id) : true)
        // ignore css files due to including the custom postcss plugin
        || id.slice(-4) === '.css'
      ) {
        return undefined;
      }

      const magicString = new MagicString(code);

      // Some packages that auto-import different files depending on the environment can have
      // this variable inside their auto-imported imported file. This will cause runtime crashes or
      // may cause development packages to be included in production builds. Example: react-dom,vue
      // This code will hoist a "process" variable and inject it with the correct environment.
      // For production builds, the code will be optimized and this "hack" will be tree-shaken.
      if (isInsideNodeModules && code.indexOf('process.env.NODE_ENV') >= 0) {
        magicString.prepend(`\n;if(!process) { var process; } process={env:{NODE_ENV:${flatObject['process.env.NODE_ENV']}}};\n`);
      }

      if (string) {
        magicString.prepend(`${string}\n`);
      } else {
        const isTypescript = id.slice(-3) === '.ts' || id.slice(-3) === '.tsx';

        Object.keys(flatObject).map((runtimeKey) => ({
          runtimeKey,
          locations: findAllMatches(runtimeKey, code),
        })).forEach(({ runtimeKey, locations }, index, array) => {
          const safeVariable = !isTypescript ? flatObject[runtimeKey] : `(${flatObject[runtimeKey]} as any)`;
          const previousLocations = [...array].reverse()
            .slice(array.length - index)
            .map((key) => key.locations)
            .reduce((acc, arr) => [...acc, ...arr], []);

          locations
            .filter((location) => previousLocations.indexOf(location) === -1)
            .forEach((location) => {
              magicString.overwrite(
                location, location + runtimeKey.length, safeVariable,
              );
            });
        });
      }

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },
  };
};

module.exports = {
  getPrependConfig,
  prepend,
};
