(async () => {
  const Overview = Vue.extend({
    name: 'over-view',
    template: `
      <div>
        <h1>Hello App!</h1>
        <ul>
          <li v-for="route in routes"><router-link v-bind:to="route.path">{{route.name}}</router-link></li>
        </ul>
      </div>
    `,
    computed: {
      routes () {
        return this.$router.options.routes
      }
    }
  });

  Vue.component('over-view', Overview);

  const App = Vue.extend({
    name: 'detail-view',
    template: `
      <div>
        <over-view v-if="!$route.name"/>
        <router-view></router-view>
      </div>
    `,
    computed: {
      routes () {
        return this.$router.options.routes
      }
    }
  });

  Vue.component('develop-preview', App);

  const Detail = Vue.extend({
    name: 'detail-view',
    template: `<div v-html="content">{{componentName}}</div>`,
    asyncComputed: {
      async content () {
        console.log('hi')
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

