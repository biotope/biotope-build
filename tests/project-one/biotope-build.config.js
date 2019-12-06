const handlebars = require('@biotope/build/plugins/handlebars');

module.exports = {
  // project: 'src',
  // output: 'dist',
  // copy: 'resources',
  // exclude: [],
  // watch: true,
  // production: true,
  // extLogic: ['.js', '.ts'],
  // extStyle: ['.css', '.scss'],
  // serve: false,
  // serve: {
  //   port: 9000,
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
  ],
};
