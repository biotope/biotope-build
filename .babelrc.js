
module.exports = {
  presets: [
    ['@babel/env', {
      targets: {
        browsers: [
          'defaults',
          'ie >= 11'
        ],
      },
      useBuiltIns: 'entry',
    }],
    ['@babel/typescript', {
      isTSX: true,
      allExtensions: true,
    }],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', {
      'loose': true,
    }],
    ['@babel/plugin-transform-classes', {
      'loose': true,
    }],
  ],
};
