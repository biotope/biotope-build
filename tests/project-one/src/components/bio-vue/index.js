import Vue from 'vue';

Vue.component('button-counter', {
  data() {
    return {
      count: 0,
    };
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>',
});

(() => new Vue({ el: '#root-vue' }))();
