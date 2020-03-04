/* eslint-disable */
(function() {
  function fetchText(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send();
    return request.status === 200 ? request.responseText : undefined;
  };

  var components = JSON.parse(fetchText('components.json'));

  var Header = Vue.extend({
    name: 'dev-preview-header',
    template: "\
      <header>\
        <img src=\"./" + __BIOTOPE_DEV_PREVIEW_ROOT + "/dev-preview.png\"/>\
        <h1>biotope development server</h1>\
      </header>\
    ",
  });

  var ComponentsList = Vue.extend({
    name: 'dev-preview-component-list',
    template: "\
      <ul>\
        <li v-for=\"item in list\">\
          <a :href=\"item + '" + __BIOTOPE_DEV_PREVIEW_PREFIX + "'\">{{ item.split('/').pop() }}</a>\
        </li>\
      </ul>\
    ",
    computed: {
      list: function() {
        return components;
      },
    },
  });

  var App = Vue.extend({
    name: 'dev-preview-app',
    components: {
      Header: Header,
      ComponentsList: ComponentsList
    },
    template: "\
      <div class=\"overview\">\
        <Header />\
        <ComponentsList />\
      </div>\
    ",
  });

  new Vue({
    el: '#dev-preview-app',
    render: function (h) { return h(App); },
  });
})();
/* eslint-enable */
