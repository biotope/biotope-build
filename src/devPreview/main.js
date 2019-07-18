(async () => {
  const Header = Vue.extend({
    name: 'dev-header',
    template: `
    <header>
      <img src="img/logo.png"/>
      <h1>biotope development server</h1>
    </header>
    `,
  });
  Vue.component('dev-header', Header);

  const ComponentList = Vue.extend({
    name: 'dev-component-list',
    template: `
      <ul>
        <li v-for="route in routes"><router-link v-bind:to="route.path">{{route.name}}</router-link></li>
      </ul>
    `,
    computed: {
      routes () {
        return this.$router.options.routes
      }
    }
  });
  Vue.component('dev-component-list', ComponentList);

  const Overview = Vue.extend({
    name: 'over-view',
    template: `
      <div class="overview">
        <dev-header/>
        <dev-component-list/>
      </div>
    `,
  });
  Vue.component('over-view', Overview);

  const App = Vue.extend({
    name: 'detail-view',
    template: `
      <div>
        <over-view v-if="!$route.name"/>
        <router-view></router-view>
      </div>
    `
  });

  Vue.component('develop-preview', App);

  const Detail = Vue.extend({
    name: 'detail-view',
    template: `<div v-html="content">{{componentName}}</div>`,
    asyncComputed: {
      async content () {
        const url = this.$route.meta.fileUrl.replace('src/', '');
        return await fetch(url).then(r => r.text());
      }
    },
    computed: {
      componentName () {
        return this.$route.name
      }
    }
  });
  
  const components = await fetch('components.json').then(r => r.json());
  const routes = components.map(component => ({
    path: `/${component.split('/')[2]}`,
    name: component.split('/')[2],
    component: Detail,
    meta: { fileUrl: component }
  }))
  const router = new VueRouter({
    routes
  })
  
  
  new Vue({
    el: '#app',
    router,
    data: {
      routes
    }
  });
})()

