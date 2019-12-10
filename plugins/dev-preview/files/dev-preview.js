/* eslint-disable */
(function() {
  function fetchText(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send();
    return request.status === 200 ? request.responseText : undefined;
  };

  var Header = Vue.extend({
    name: 'dev-header',
    template: "\
      <header>\
        <img src=\"./" + __BIOTOPE_DEV_PREVIEW_ROOT + "/dev-preview.png\"/>\
        <h1>biotope development server</h1>\
      </header>\
    ",
  });
  Vue.component('dev-header', Header);

  var ComponentList = Vue.extend({
    name: 'dev-component-list',
    template: "\
      <ul>\
        <li v-for=\"route in routes\"><router-link v-bind:to=\"route.path\">{{route.name}}</router-link></li>\
      </ul>\
    ",
    computed: {
      routes: function() {
        return this.$router.options.routes;
      },
    },
  });
  Vue.component('dev-component-list', ComponentList);

  var Overview = Vue.extend({
    name: 'over-view',
    template: "\
      <div class=\"overview\">\
        <dev-header/>\
        <dev-component-list/>\
      </div>",
  });
  Vue.component('over-view', Overview);

  var App = Vue.extend({
    name: 'detail-view',
    template: "\
      <div>\
        <over-view v-if=\"!$route.name\"/>\
        <router-view></router-view>\
      </div>\
    ",
  });
  Vue.component('develop-preview', App);

  var Detail = Vue.extend({
    name: 'detail-view',
    template: '<div v-html="content">{{componentName}}</div>',
    computed: {
      componentName: function() {
        return this.$route.name;
      },
      content: function() {
        var url = this.$route.meta.fileUrl.replace('src/', '');
        return fetchText(url);
      },
    },
  });

  var components = JSON.parse(fetchText('components.json'));
  var routes = components.map(function(component) {
    return {
      path: '/' + component.split('/').pop().replace(/\//g, '_'),
      name: component.split('/').pop(),
      component: Detail,
      meta: { fileUrl: component },
    };
  });
  var router = new VueRouter({
    routes: routes,
  });

  new Vue({
    el: '#app',
    router: router,
    data: {
      routes: routes,
    },
  });
})();
/* eslint-enable */
