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

const isBetween = (needleIndex, haystack, left, right) => {
  let opened = false;
  for (let index = 0; index < needleIndex; index += 1) {
    if (haystack[index] === '\\') {
      index += 1;
    } else if (!opened && haystack.substr(index, left.length) === left) {
      opened = true;
      index += left.length - 1;
    } else if (opened && haystack.substr(index, right.length) === right) {
      opened = false;
      index += right.length - 1;
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
    || isBetween(location, string, '"', '"')
    || isBetween(location, string, '\'', '\'')
  ));
};

const prepend = ({
  string, object, extensions, nodeModules,
}) => {
  const flatObject = object && !string ? getFlatObject(object) : null;

  return {
    name: 'biotope-build-prepend',
    transform(code, id) {
      if (
        (!string && !object)
        || (!nodeModules && id.indexOf(resolve(`${process.cwd()}/node_modules`)) === 0)
        || (extensions ? !(new RegExp(`(${extensions.join('|')})$`)).test(id) : true)
      ) {
        return undefined;
      }

      // FIXME - React-DOM package is not being included correctly
      // 1) both "dev" and "prod" are being included in every build
      // 2) "process.env.NODE_ENV" is not defined and causes causes this error at runtime:
      // Uncaught ReferenceError: process is not defined
      //   at react.js:27075
      //   at createCommonjsModule (bundle.js:8)
      //   at react.js:27053

      const magicString = new MagicString(code);

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
