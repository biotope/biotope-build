
const TYPESCRIPT_ES6_CONFIG = {
  compilerOptions: {
    target: 'es6',
  },
};

export const getTypescriptConfig = (): object => ({
  // eslint-disable-next-line global-require
  typescript: require('typescript'),
  tsconfigOverride: TYPESCRIPT_ES6_CONFIG,
});
