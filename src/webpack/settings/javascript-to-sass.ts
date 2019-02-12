
const flattenObject = (
  variables: IndexObjectAny,
  prefix: string = '',
): IndexObject<string> => Object.keys(variables)
  .reduce((accumulator, key) => ({
    ...accumulator,
    ...(typeof variables[key] === 'object'
      ? flattenObject(variables[key], `${prefix}${prefix ? '_' : ''}${key}`)
      : { [`${prefix}${prefix ? '_' : ''}${key}`]: variables[key] }
    ),
  }), {});

export const javascriptToSass = (variables: IndexObjectAny): string => {
  const flattenVariables = flattenObject(variables);

  return Object.keys(flattenVariables)
    .reduce((accumulator, key) => `${accumulator}$${key}:'${flattenVariables[key]}';`, '');
};
