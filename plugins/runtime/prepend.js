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

const createRegex = (variable) => new RegExp(`(?<![A-z0-9\\._$€])${variable.split('.').join('\\.')}(?![A-z0-9\\._$€])`, 'g');

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

      // Fixes some packages that do not tree-shake well
      // Example: React-DOM includes both "dev" and "prod" builds if this is not done
      if (isInsideNodeModules && code.indexOf('process.env.NODE_ENV') >= 0) {
        magicString.prepend(`;var process={env:{NODE_ENV:${flatObject['process.env.NODE_ENV']}}};\n`);
      }

      if (string) {
        magicString.prepend(`${string}\n`);
      } else {
        Object.keys(flatObject).map((runtimeKey) => ({
          runtimeKey,
          locations: findAllMatches(runtimeKey, code),
        })).forEach(({ runtimeKey, locations }) => {
          locations.forEach((location) => {
            magicString.overwrite(location, location + runtimeKey.length, flatObject[runtimeKey]);
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
