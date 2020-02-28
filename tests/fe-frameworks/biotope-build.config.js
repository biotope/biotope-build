const react = require('@biotope/build/plugins/react');
const vue = require('@biotope/build/plugins/vue');
const handlebars = require('@biotope/build/plugins/handlebars');

module.exports = {
  maps: true,
  legacy: {
    exclusivePackages: ['@webcomponents/webcomponentsjs'],
  },
  componentsJson: true,
  extLogic: ['.js', '.mjs', '.ts', '.jsx', '.tsx', '.vue'],
  chunks: {
    'biotope-element': ['@webcomponents/webcomponentsjs', '@biotope/element'],
    react: ['react', 'react-dom'],
    vue: ['vue'],
  },
  plugins: [
    react(),
    vue(),
    // vue({ runtimeOnly: true }), // use with Vue SFC (example: components/vue-hello)
    handlebars({ source: ['src/*.hbs'] }),
  ],
  runtime: {
    IDS: {
      JS_REACT: 'js-react-root',
      TS_ELEMENT: 'ts-element-root',
      TS_REACT: 'ts-react-root',
      TS_VUE: 'ts-vue-root',
      VUE_SFC: 'vue-sfc-root',
    },
    PLACEHOLDERS: {
      JS_REACT: 'Javascript React',
      TS_ELEMENT: 'Typescript Biotope-element',
      TS_REACT: 'Typescript React',
      TS_VUE: 'Typescript Vue',
      VUE_SFC: 'Vue Single-File-Component',
    },
    COLORS: {
      SUCCESS: 'green',
      FAIL: 'red',
    },
  },
};
