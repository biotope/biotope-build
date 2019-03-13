
const isNumber = (variable: string): boolean => {
  const value = parseInt(variable, 10);
  // Comparing against itself to check if it is NaN
  // eslint-disable-next-line no-self-compare
  return value === value && typeof value === 'number';
};

const toSassVariable = (variable: string): string => (!isNumber(variable) ? `'${variable}'` : variable);

const flattenObject = (
  variables: IndexObjectAny,
  prefix: string = '',
): IndexObject<string> => Object.keys(variables)
  .reduce((accumulator, key) => ({
    ...accumulator,
    ...(typeof variables[key] === 'object'
      ? flattenObject(variables[key], `${prefix}${prefix ? '_' : ''}${key}`)
      : { [`${prefix}${prefix ? '_' : ''}${key}`]: toSassVariable(variables[key]) }
    ),
  }), {});

export const javascriptToSass = (variables: IndexObjectAny): string => {
  const flattenVariables = flattenObject(variables);

  return Object.keys(flattenVariables)
    .reduce((accumulator, key) => `${accumulator}$${key}:${flattenVariables[key]};`, '');
};
