import React from 'react';
import ReactDOM from 'react-dom';
import Vue from 'vue';
import loadEntry from 'load-entry';
import { JsReactHello } from './components/js-react-hello';
import { TsElementHello } from './components/ts-element-hello';
import { TsReactHello } from './components/ts-react-hello';
import { VueHello } from './components/vue-hello';
import { TsVueHello } from './components/ts-vue-hello';

loadEntry(() => {
  TsElementHello.register();
  document.querySelector(`#${IDS.TS_ELEMENT}`).innerHTML = '<ts-element-hello></ts-element-hello>';
}, { event: 'WebComponentsReady' });

ReactDOM.render(JsReactHello(), document.querySelector(`#${IDS.JS_REACT}`));
ReactDOM.render(React.createElement(TsReactHello), document.querySelector(`#${IDS.TS_REACT}`));

(() => new Vue({
  el: `#${IDS.VUE_SFC}`,
  components: { VueHello },
  render: (h) => h(VueHello),
}))();
(() => new Vue({
  el: `#${IDS.TS_VUE}`,
  components: { TsVueHello },
  render: (h) => h(TsVueHello),
}))();
