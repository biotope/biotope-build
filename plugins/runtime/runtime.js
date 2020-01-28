const { resolve } = require('path');
const { readFileSync } = require('fs-extra');
const { parse } = require('dotenv');

const getDotEnv = () => {
  try {
    return parse(readFileSync(resolve(`${process.cwd()}/.env`)));
  } catch (_) {
    return {};
  }
};

const getRuntime = (config) => ({
  ENVIRONMENT: config.production ? 'production' : 'development',
  ...(typeof config.runtime === 'object' ? config.runtime : {}),
  ...getDotEnv(),
});

const getRuntimeJavascript = (variables) => {
  const finalVariables = {
    ...variables,
    process: {
      env: {
        NODE_ENV: variables.ENVIRONMENT,
      },
    },
  };
  return finalVariables;
};

const isNumber = (variable) => {
  const value = parseFloat(variable);
  return !Number.isNaN(value) && typeof value === 'number';
};

const toSassVariable = (variable) => (
  !isNumber(variable) && (variable || '')[0] !== '#' ? `'${variable}'` : variable
);

const flattenName = (prefix, key) => `${prefix}${prefix ? '_' : ''}${key}`;

const flattenObject = (variables, prefix = '') => Object.keys(variables)
  .reduce((accumulator, key) => ({
    ...accumulator,
    ...(typeof variables[key] === 'object'
      ? flattenObject(variables[key], flattenName(prefix, key))
      : { [flattenName(prefix, key)]: toSassVariable(variables[key]) }
    ),
  }), {});

const getRuntimeSass = (variables) => {
  const flattenVariables = flattenObject(variables);

  return Object.keys(flattenVariables)
    .reduce((accumulator, key) => `${accumulator}$${key}:${flattenVariables[key]};`, '');
};

module.exports = {
  getRuntime,
  getRuntimeJavascript,
  getRuntimeSass,
};
