import Vue from 'vue';
import HelloWorld from './component.vue';

(() => new Vue({
  el: '#root-vue',
  components: { HelloWorld },
  render: (h) => h(HelloWorld),
}))();
