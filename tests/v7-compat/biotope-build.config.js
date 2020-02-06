const devPreview = require('@biotope/build/plugins/dev-preview');
const noCodeSplit = require('@biotope/build/plugins/no-code-split');
const handlebars = require('@biotope/build/plugins/handlebars');
const favicons = require('@biotope/build/plugins/favicons');
const manifestJson = require('@biotope/build/plugins/manifest-json');

module.exports = {
  maps: true,
  componentsJson: true,
  legacy: {
    only: true,
  },
  style: {
    modules: false,
  },
  chunks: {
    'biotope-element': ['@biotope/element'],
  },
  copy: [
    'resources',
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
  plugins: [
    devPreview(),
    noCodeSplit({ files: 'all' }),
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
      source: 'src/assets/favicon.png',
      destination: 'favicons',
      options: {
        appName: 'ProjectOne',
        theme_color: '#3367D6',
        appleStatusBarStyle: 'black-translucent',
      },
    }),
    manifestJson({
      short_name: 'ProjectOne',
      name: 'Biotope Build Project One',
      start_url: '/',
      background_color: '#FFF',
      display: 'standalone',
      scope: '/',
      theme_color: '#3367D6',
    }),
  ],
};
