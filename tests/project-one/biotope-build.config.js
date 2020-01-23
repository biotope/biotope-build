const favicons = require('@biotope/build/plugins/favicons');
const handlebars = require('@biotope/build/plugins/handlebars');
const devPreview = require('@biotope/build/plugins/dev-preview');
const manifestJson = require('@biotope/build/plugins/manifest-json');
const jsx = require('@biotope/build/plugins/jsx');
// const noCodeSplit = require('@biotope/build/plugins/no-code-split'); // CURRENTLY NOT WORKING

module.exports = {
  // project: 'src',
  // output: 'dist',
  copy: [
    // 'resources',
    {
      // FIXME (node:20534) UnhandledPromiseRejectionWarning:
      // Error: ENOENT: no such file or directory, stat 'src/resources'
      from: 'src/resources',
      to: 'resources',
      ignore: ['favicon.png'],
    },
    {
      from: 'node_modules/@webcomponents/webcomponentsjs/*.js',
      to: 'polyfills',
      ignore: ['es5-adapter.js$'],
    },
    {
      from: 'node_modules/@webcomponents/webcomponentsjs/bundles/**/*',
      to: 'polyfills/bundles',
      ignore: ['.map$'],
    },
  ],
  // exclude: [],
  // watch: true,
  // production: true,
  extLogic: ['.js', '.ts', '.jsx', '.tsx'],
  // extStyle: ['.css', '.scss'],
  componentsJson: 'components\\/.*\\/index\\.(j|t)sx?$',
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
  // chunks: true,
  chunks: {
    'biotope-element': ['@biotope/element'],
    react: ['react', 'react-dom'],
    // style: ['src/style/index.ts'], // TODO - project-code chunks
  },
  style: {
    extract: true,
    // global: true,
    // modules: false,
  },
  runtime: {
    COLORS: {
      PRIMARY: '#ff0000',
    },
    LAYERS: {
      BASE: 0,
      PRIORITY: 100,
    },
    EXAMPLE_TEXT: 'runtime variables are awesome!',
  },
  plugins: [
    // ['before-build', (...args) => console.log('BEFORE', ...args)],
    // ['after-build', (...args) => console.log('AFTER', ...args)],
    jsx(),
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
    favicons({
      source: 'src/resources/favicon.png',
      destination: 'favicons',
    }),
    devPreview(),
    // devPreview({
    //   output: 'preview',
    //   // prepend: '//non-existing-file-one.js',
    //   // append: ['//non-existing-file-two.js', '//non-existing-file-three.js'],
    // }),
    manifestJson({
      short_name: 'ProjectOne',
      name: 'Biotope Build Project One',
      start_url: '/',
      background_color: '#FFFFFF',
      display: 'standalone',
      scope: '/',
      theme_color: '#3367D6',
    }),
    // noCodeSplit({
    //   files: 'legacy',
    //   // files: 'all',
    // }),

    // Example of custom function plugin
    // function test() {
    //   console.log('\n::Custom Plugin Start::\n');
    //   throw new Error('## Custom Plugin ERROR ##');
    // },
  ],
};
