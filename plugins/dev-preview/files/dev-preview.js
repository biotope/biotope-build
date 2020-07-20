/* eslint-disable */
(function() {
  function fetchText(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send();
    return request.status === 200 ? request.responseText : undefined;
  };

  var components = JSON.parse(fetchText('components.json')).map(function (ref) {
    var splitRef = ref.split('/');
    var isIndexFile = splitRef[splitRef.length - 1].split('.')[0] === 'index';
    var hasScaffoldingFolder = splitRef[splitRef.length - 2] === 'scaffolding';
    return {
      label: isIndexFile
        ? splitRef[splitRef.length - 2 - (hasScaffoldingFolder ? 1 : 0)]
        : (hasScaffoldingFolder ? [splitRef[splitRef.length - 3]] : []).concat(
          [splitRef[splitRef.length - 2], splitRef[splitRef.length - 1]]
        ).join(','),
      file: ref
    };
  });

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
          <a :href=\"item.file\">{{ item.label }}</a>\
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