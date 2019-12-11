const handlebars = require('@biotope/build/plugins/handlebars');
const devPreview = require('@biotope/build/plugins/dev-preview');
// const noCodeSplit = require('@biotope/build/plugins/no-code-split');

module.exports = {
  // project: 'src',
  // output: 'dist',
  copy: [
    'resources',
    {
      from: 'node_modules/@webcomponents/webcomponentsjs/*.js',
      to: 'dist/polyfills',
      ignore: ['es5-adapter.js$'],
    },
    {
      from: 'node_modules/@webcomponents/webcomponentsjs/bundles/**/*',
      to: 'dist/polyfills/bundles',
    },
  ],
  // exclude: [],
  // watch: true,
  // production: true,
  // extLogic: ['.js', '.ts'],
  // extStyle: ['.css', '.scss'],
  // serve: false,
  // serve: {
  //   port: 9000,
  //   open: false,
  // },
  legacy: true,
  // legacy: {
  //   inline: false,
  //   suffix: '.ie11',
  // },
  chunks: true,
  // chunks: {
  //   'biotope-element': ['@biotope/element'],
  //   // style: ['src/style/index.ts'], // TODO - project-code chunks
  // },
  runtime: {
    COLORS: {
      PRIMARY: '#ff0000',
    },
    PRIORITY_LAYER: 100,
    VARIABLE_NOT_FOUND_IN_COMPILED_CODE_BECAUSE_ITS_NOT_USED: 'runtime variables are awesome!',
  },
  plugins: [
    // ['before-build', (...args) => console.log('BEFORE', ...args)],
    // ['after-build', (...args) => console.log('AFTER', ...args)],
    handlebars({
      source: [
        'src/components/**/scaffolding/*.hbs',
      ],
      partial: [
        'src/components/**/*.hbs',
      ],
      data: [
        'src/components/**/*.json',
        'src/resources/**/*.json',
      ],
    }),
    devPreview(),
    // devPreview({
    //   output: 'preview',
    //   // prepend: '//non-existing-file-one.js',
    //   // append: ['//non-existing-file-two.js', '//non-existing-file-three.js'],
    // }),
    // noCodeSplit({
    //   // files: 'all',
    //   files: 'legacy',
    // }),
  ],
};
